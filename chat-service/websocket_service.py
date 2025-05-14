from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
import redis
import logging
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(match_users())
    yield

# Initialize FastAPI app with lifespan context manager
app = FastAPI(lifespan=lifespan)

# Add CORS middleware to allow connections from the HTML client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Redis
redis_client = redis.StrictRedis(host='redis-service', port=6379, decode_responses=True)

# Active connections
active_connections = {}

# Redis queue for matchmaking
MATCHMAKING_QUEUE = "matchmaking_queue"

# Timeout duration in seconds
INACTIVITY_TIMEOUT = 300  # 5 minutes

async def match_users():
    while True:
        # Check if there are at least two users in the queue
        users = redis_client.smembers(MATCHMAKING_QUEUE)
        if len(users) >= 2:
            user1, user2 = list(users)[:2]
            redis_client.srem(MATCHMAKING_QUEUE, user1, user2)
            logging.info(f"Matched users: {user1} and {user2}")

            # Notify both users
            if user1 in active_connections and user2 in active_connections:
                await active_connections[user1].websocket.send_text(f"You are now connected to user {user2}.")
                await active_connections[user2].websocket.send_text(f"You are now connected to user {user1}.")

                # Pair the users
                active_connections[user1].partner = user2
                active_connections[user2].partner = user1
        await asyncio.sleep(1)

class Connection:
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.partner = None

class ConnectionManager:
    def __init__(self):
        self.connections = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.connections[user_id] = websocket
        redis_client.sadd(MATCHMAKING_QUEUE, user_id)
        logging.info(f"User {user_id} connected and added to matchmaking queue.")

    def disconnect(self, user_id: str):
        if user_id in self.connections:
            del self.connections[user_id]
        redis_client.srem(MATCHMAKING_QUEUE, user_id)
        logging.info(f"User {user_id} disconnected and removed from matchmaking queue.")

    async def send_message(self, user_id: str, message: str):
        if user_id in self.connections:
            await self.connections[user_id].send_text(message)

    async def next_chat(self, user_id: str):
        if user_id in self.connections:
            # Disconnect the user from the current partner
            partner_id = active_connections[user_id].partner
            if partner_id and partner_id in active_connections:
                await self.send_message(partner_id, "Your partner has left the chat.")
                active_connections[partner_id].partner = None

            # Reset the user's partner and re-add them to the matchmaking queue
            active_connections[user_id].partner = None
            redis_client.sadd(MATCHMAKING_QUEUE, user_id)
            logging.info(f"User {user_id} requested to find a new chat partner.")

manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    connection = Connection(websocket)
    active_connections[user_id] = connection
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await asyncio.wait_for(websocket.receive_text(), timeout=INACTIVITY_TIMEOUT)
            logging.info(f"{data}")

            if data == "next":
                await manager.next_chat(user_id)
                await websocket.send_text("Searching for a new chat partner...")
                continue

            # Forward the message to the partner
            partner_id = active_connections[user_id].partner
            if partner_id and partner_id in active_connections:
                await manager.send_message(partner_id, f"{data}")
            else:
                await websocket.send_text("Your partner is no longer connected.")
    except asyncio.TimeoutError:
        logging.info(f"Inactivity timeout for user {user_id}")
        await websocket.send_text("Connection closed due to inactivity.")
    except WebSocketDisconnect:
        logging.info(f"User {user_id} disconnected.")
    finally:
        manager.disconnect(user_id)
        active_connections.pop(user_id, None)

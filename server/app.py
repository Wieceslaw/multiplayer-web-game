import asyncio
import json

import os
from uuid import uuid4

import websockets
from websockets.exceptions import ConnectionClosedOK

CLIENTS = dict()


async def producer_handler(websocket, client_id):
    while True:
        # await websocket.send("Update")
        await asyncio.sleep(2)


async def consumer_handler(websocket, client_id):
    async for message in websocket:
        print(message)
        json_message = json.loads(message)
        event = json_message["event"]
        data = json_message["data"]
        if event == "player":
            broadcast(client_id, json.dumps({
                "event": "player",
                "data": {
                    "player": data["player"],
                    "id": str(client_id)
                }
            }))
        else:
            print("Unexpected event")


def broadcast(client_id, message):
    recievers = set(CLIENTS.values())
    recievers.remove(CLIENTS[client_id])
    websockets.broadcast(recievers, message)


async def handler(websocket):
    client_id = uuid4()
    CLIENTS[client_id] = websocket
    print(f"[INFO]: Client {client_id} connected")
    try:
        await asyncio.gather(
            producer_handler(websocket, client_id),
            consumer_handler(websocket, client_id)
        )
    except ConnectionClosedOK:
        del CLIENTS[client_id]
        print(f"[INFO]: Client {client_id} disconnected")


async def main():
    print("Starting serving!")
    async with websockets.serve(handler, "", port=int(os.environ["PORT"])):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())

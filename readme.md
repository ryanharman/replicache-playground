### replicache playground

thinking - creating a typesafe way of easily working with replicache on both client and server.

Client side = replicache mutations + subscriptions
Server side = database mutations w/push and pull + pokes to update client

Connector to bridge the two w/Drizzle & Zod schemas?

PUSH endpoint to delegate mutations to designated "service" functions that will handle data updates in DB

PULL endpoint needs to handle providing all (or as much as possible) data to the client on init and or during a poke

# News-Radar Project

- all prefs in client storage
- send as jwt with reqs
- backend is stateless functions
- backend has access to treegraph db, flat doc db of items
- me/explore/everyone
- can suggest related topics, sources

## Client knows
- preferences
- topic tags +/- values, top 10 or so positive ones for short
- id's of articles you've read before, to not re-show (could limit to rolling 100?)
- ids of articles you've favorited (could limit to rolling 100?)

## Service knows
- list of all articles
- meta-info of each article, +/-, topic tags, views
- sources to get articles
- once users decide to sync multiple devices, we may store an anonymized and obfuscated listing of that user's preferences? 

- user searches for a topic
  - system searches news aggregator for that topic
  - aggregator returns the top articles, we save them to article db under labels for that search topic, then return those top articles to user, adding ogdata image from article

## App
- new/explore/popular/saved
- new: give 10+ articles, balanced by my favorite topics
for topics:
1. cars
2. food
3. computers

for 10 articles, there should be:
1. 5 count
2. 3 count
3. 2 count

1. (10-0) / 2
2. (10-1) / 2
3.

- went with even distribution for now
- avg.floor +1 per slot
- 10 items, 3 topics, avg is 3.33
- avg.floor is 3 + 1 = 4
1. 4
2. 4
3. 4

## Tasks
- [x] save labels to article
- [x] search db, then aggregator
- [x] get new articles functions
- [x] filter read articles backend
- [ ] archive of read articles backend
- [ ] archive of read articles fronted
- [ ] read articles frontend
- [ ] populate topics frontend
- [ ] saved articles frontend
- [ ] search frontend
- [ ] new articles frontend
- [ ] uprank / downrank topic/article frontend

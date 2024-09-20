# Who Is Going To Win?

[_Who Is Going To Win?_](https://www.whoisgoingto.win/) is a Remix app that displays the predictions of several election forecast models for the 2024 US Presidential Election. It is configured to run on Vercel using edge functions for the frontend and serverless functions for data scraping.

## Features

- Very fast load times, worldwide, by using server-rendered edge functions and a globally distributed Redis database.
- Tailor-made scrapers for each source.
- Mobile and desktop views with automatic dark mode.

## Flaws

- The data scraping for most sites is entirely dependent on how this site is currently set up, so scrapers can break due to these circumstances outside our control. However, if one source breaks, the others are unaffected.
- Nate Silver's forecast must be updated manually.

## Requirements

To run locally:

- A Redis database at [Upstash](https://upstash.com/).
- A username and password at [The Economist](https://www.economist.com/). The state of the race [is visible](https://www.economist.com/interactive/us-2024-election/prediction-model/president) without logging in. However, the toplines are parsed as fractions (e.g. 'Harris has about a 3 in 5 chance'). To grab the percentages, we need to log in. A subscription is not required.

To deploy:

- A [Vercel](https://vercel.com/) account.
- A cron job service like [cron-job.org](https://cron-job.org/) to update the scrapers on an interval.

## Installation

### Spinning up the front-end locally

1. Use `npm i` to install the packages.
2. Create an .env file in the project's root. Add the following lines and replace the values with your own:

```
NODE_ENV=development

# DB
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
```

3. Use `npm run setup-redis` to seed the db with placeholder data.
4. Use `npm run dev` to run locally! If that doesn't work, run `npm run dev -- --host`.

At this point, the site should load, but it will display placeholder data.

### Getting fresh data

All data is updated by pinging the route for that source. For instance, to update the Polymarket data, visit [localhost:5173/updatePolymarket](localhost:5173/updatePolymarket).

To enable scraping The Economist, add this to your .env file:

```
# Economist credentials
ECONOMIST_USERNAME=your_username
ECONOMIST_PASSWORD=your_password
```

We'll want to ping these routes regularly. In production, they are protected to prevent others from activating them.\
You can use [cron-job.org](https://cron-job.org/) to set up a job for each route, while adding an Authorization header. In the Advanced tab, add a header with the key `Authorization` and a value `Bearer >> your_random_secret_token`. Then, in Vercel, add this token as an environment variable `CRON_SECRET`.

Make sure not to scrape data too often from the sources. Once per hour should be fine.

### Deploying

Deploy to Vercel using the Vercel CLI or by pushing your repo to GitHub and using Vercel's GUI. Simply use Vercel's default settings for Remix, add the environment variables, and you're done!
Please note that Analytics and Speed Insights, which are subject to usage limits, are enabled by default in this app.

### Manually entering data

For sources that can't be scraped, or during development, you might want to manually enter data. To do this, enter the Upstash CLI and use the following command:

```
hset sourceName fieldName value
```

For example:

```
hset nateSilver repPercentage 60
```

## Q&A

_Can I run this on a different platform than Vercel?_\
Being a Remix app, it is possible to port this to a different platform, like Fly.io, but this will require some tinkering. You'll need to replace any @vercel packages with ones appropriate for your platform. You might also need to find a different way to run Playwright, because this app uses @sparticuz/chromium which is built for serverless platforms. The frontend is designed to use cache-control headers and edge functions, which are not supported on all platforms.

_Does this app violate fair use?_\
In my opinion, the data this app gathers and displays is sufficiently limited to be considered fair use. All data is publicly available, and only the topline numbers are displayed.\
The Economist requires the app to log in only because the topline displayed without logging in is a fraction _(e.g. 'Harris has about a 3 in 5 chance')_. This does not allow an easy comparison with the other models, which is why we grab the percentages instead.

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)

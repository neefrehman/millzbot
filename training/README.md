# Getting training data

This folder contains [Max Woolf's script](https://github.com/minimaxir/download-tweets-ai-text-gen/blob/master/README.md) to batch-download tweets from a user, which can then be used for training. You can see the [full instructions there](https://github.com/minimaxir/download-tweets-ai-text-gen/blob/master/README.md), and I've included basic instructions to get started below.

## Simple usage

Install the Python dependencies:

```sh
pip3 install twint==2.1.4 fire tqdm
```

`cd` into this folder, and in your terminal run:

```sh
python3 download_tweets.py <twitter_username>
```

For example, to get the tweets from @millzbot run:

```sh
python3 download_tweets.py millzbot
```

The tweets will be downloaded to a CSV in this folder titled `<usernames>_tweets.csv`, which can then be used for training using [Max's Colaboratory notebook](https://colab.research.google.com/drive/1qxcQ2A1nNjFudAGN_mcMOnvV9sF_PkEb). If you want to keep the downloaded tweets private, place the file in the `data` folder, to ensure it doesn't get commited via git.

When following the Colaboratory notebook instructions, the finetuning of GPT-2 could take hours, so check on it every now and again but otherwise relax! I used the `124M` GPT-2 model, and in total trained millzbot with 10,000 tweets.

<img src="/assets/colab.png" alt="Screenshot of training output" width="100%">

Once it's complete, test the model a few times with the notebook's [generate cell](https://colab.research.google.com/drive/1qxcQ2A1nNjFudAGN_mcMOnvV9sF_PkEb#scrollTo=8DKMc0fiej4N&line=8&uniqifier=1). Try changing some of the variables like `temperature` or `prefix` (if you change `prefix`, test what happens if you add `include_prefix=False`, too). Once you're happy with the model, download it, and uncompress it inside the `/server/model` folder (this will also be hidden from git).

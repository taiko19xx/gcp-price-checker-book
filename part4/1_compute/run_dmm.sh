#!/bin/bash

export NOTICE_SLACK_CHANNEL=（SlackのチャンネルID）
export NOTICE_SLACK_TOKEN=（SlackのBot User OAuth Token）
export NOTICE_DISCORD_CHANNEL=（DiscordのチャンネルID）
export DISCORD_TOKEN=（DiscordのBOT Token）
export DMM_API_ID=（DMMのアフィリエイトID）
export DMM_AFFILIATE_ID=（DMMのAPI ID）

export CHECKER_SITE=DMM.com
node runner.js

export CHECKER_SITE=FANZA
node runner.js
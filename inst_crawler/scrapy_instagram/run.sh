#!/usr/bin/env bash
source /home/longedok/.virtualenvs/scraper/bin/activate

scrapy crawl locations -a loc_id=$1
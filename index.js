import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { tweetsData } from './data/data.js';


// Listen for the "like" "retweet" "reply" click, and for adding tweet
document.addEventListener('click', function(e) {
    if(e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like);

    } else if(e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet);

    } else if(e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply);

    } else if(e.target.id === 'tweet-btn') {
        handleTweetBtnClick();
    }
    
    // Note: I used else if() instead of if(), because I don't want 
    // the second condition to run if the first is true
});



// When the liked get clicked
function handleLikeClick(tweetId) { 
    const targetTweetObj = tweetsData.find(function(tweet) {
        return tweet.uuid === tweetId;
    });

    if(!targetTweetObj.isLiked) {
        targetTweetObj.likes++;
        
    } else{
        targetTweetObj.likes--;
    }

    // Flip the value, for whether liked or unliked, and for styling as well
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    render();
}

// When the retweet get clicked
function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId;
    })[0];

    if(!targetTweetObj.isRetweeted) {
        targetTweetObj.retweets++;

    } else {
        targetTweetObj.retweets--;
    }

    // Flip the value, for whether retweed or unretweeted, and for styling as well
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    render();
}

// When the reply get clicked
function handleReplyClick(replyId) {
    // Getting the div that holds the replies
    document.getElementById('replies-' + replyId).classList.toggle('hidden')
}

// When the tweet button get clicked
function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input');

    if(tweetInput.value) {
        const newTweet = {
            handle: '@Scrimba',
            profilePic: 'images/scrimbalogo.png',
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLikes: false,
            isRetweeted: false,
            uuid: uuidv4()
        }
    
        tweetsData.unshift(newTweet);
        render();
    }
}


function getFeedHtml() {
    let feedHtml = '';

    tweetsData.forEach(function(tweet) {
        // For styling the like and retweeted when they are clicked
        let likeIconClass = tweet.isLiked && 'liked';
        let retweetIconClass = tweet.isRetweeted && 'retweeted';

        // Checking if there's any replies on this tweet if so:
        let repliesHtml = '';
        if(tweet.replies.length) {
            tweet.replies.forEach(function(reply) {
                repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic" />
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
        }


        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i data-reply="${tweet.uuid}" class="fa-regular fa-comment-dots"></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i data-like="${tweet.uuid}" class="fa-solid fa-heart ${likeIconClass}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i data-retweet="${tweet.uuid}" class="fa-solid fa-retweet ${retweetIconClass}"></i>
                                ${tweet.retweets}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>
        `;
    });

    return feedHtml;
}


function render() {
    // Display on my feed div what's gonna comes from the function getFeedHtml()
    document.querySelector('#feed').innerHTML = getFeedHtml();
}

render();

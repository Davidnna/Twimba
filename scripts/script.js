const dataFromLocalStorage = JSON.parse( localStorage.getItem("tweetsData") )

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.showReplies){
        handleReplyClick(e.target.dataset.showReplies)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.reply){
        handleReplyBtnClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.menu){
        handleMenuClick(e.target.dataset.menu)
    }
    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
    else if (!e.target.matches('.tweet-menu') && !e.target.matches('.delete-btn')) {
        handleCloseMenu()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value.trim()){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            // profilePic: `https://i.postimg.cc/d3zPBN1t/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        render()
        tweetInput.value = ''
    }
}

function handleReplyBtnClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const replyInput = document.getElementById(`reply-${targetTweetObj.handle}`)

    if(replyInput.value.trim()){
        targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            // profilePic: `https://i.postimg.cc/d3zPBN1t/scrimbalogo.png`,
            tweetText: replyInput.value,
        })
        render()
        replyInput.value = ""
        document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
    }
}

function handleMenuClick(tweetId){
    document.getElementById(`delete-${tweetId}`).classList.toggle('hidden')
}

function handleDeleteClick(tweetId){
    const targetTweetIndex = tweetsData.findIndex(function(tweet){
        return tweet.uuid === tweetId
    })
    tweetsData.splice(targetTweetIndex, 1)
    render()
}

function handleCloseMenu(){
    const deleteBtns = document.querySelectorAll('.delete-btn')
    deleteBtns.forEach(function(button){
        button.classList.add('hidden')
    })
}

if (dataFromLocalStorage){
    tweetsData = dataFromLocalStorage
    console.log('Data from Local Storage:', dataFromLocalStorage)
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        const likeIconClass = tweet.isLiked ? 'liked' : ''        
        const retweetIconClass = tweet.isRetweeted ? 'retweeted' : ''        
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic" alt="Profile Picture of ${reply.profilePic}">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                `
            })
        }
          
        feedHtml += `
            <div class="tweet"">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic" alt="Profile Picture of ${tweet.profilePic}">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots" data-show-replies="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>
                    <p class="tweet-menu" data-menu="${tweet.uuid}">...</p>
                    <button type="button" class="delete-btn hidden" id="delete-${tweet.uuid}" data-delete="${tweet.uuid}">Delete Tweet</button>
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                    <div class="reply">
                        <label for="reply-${tweet.handle}" class="reply-label">Reply This Tweet</label>
                        <input type="text" id="reply-${tweet.handle}" class="reply-input" placeholder="Tweet your reply">
                        <button type="button" class="reply-btn" data-reply="${tweet.uuid}">Reply</button>
                    </div>
                </div>
            </div>
        `
   })
   return feedHtml 
}

function render(){
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
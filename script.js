

function convertSecondsToMinutes(seconds) {
    const totalSeconds = Math.floor(seconds); // Truncate to an integer
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
  
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  }


async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let responce = await a.text();

    let div = document.createElement("div")
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split('/songs/')[1])
        }

    }
    return songs
}

let currentsong = new Audio()

const playmusic= (track,pause=false) =>{
    // let audio = new Audio("/songs/"+ track)
    currentsong.src = "/songs/"+ track
    if(!pause){
        currentsong.play()
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    let songs = await getsongs()
    console.log(songs)
    playmusic(songs[0],true)
   

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll('%20',' ')}</div>
            <div>Arun</div>
        </div>
        <div class="playnow">
            <img src="play.svg" alt="">
            <span>Play Now</span>
        </div></li>`

    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>
        {e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
 })
    play.addEventListener("click", () =>{
        if(currentsong.paused){
            currentsong.play()
            play.src="pause.svg"
        }else{
            currentsong.pause()
            play.src="play.svg"
        }
    })


    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentsong.currentTime)}/${convertSecondsToMinutes(currentsong.duration)}`
        document.querySelector(".circle1").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener('click',e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle1").style.left=percent + "%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100

    })
 
}

main()
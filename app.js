// 1.Render songs
// 2.Scroll Top
// 3.Play/Pause/Seek 
// 4.CD rotate
// 5.Next/Prev
// 6.Random
// 7.Next/Prev when ended
// 8.Active song
// 9.Scroll active song into view
// 10.Play song when click
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_Player'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const song = $('song')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeated: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key,value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'ABCDEFU',
            singer: 'Gayle',
            path: './mp3/abcdefu-gayle.mp3',
            image: './img/Gayle_-_ABCDEFU.png'
        },
        {
            name: 'Die For You',
            singer: 'Joji',
            path: './mp3/Die-For-You-Joji.mp3',
            image: './img/die-for-you-joji-lyrics-200.jpg'
        },
        {
            name: 'Glimpse Of Us',
            singer: 'Joji',
            path: './mp3/Glimpse-Of-Us.mp3',
            image: './img/glimpse-of-us.jfif'
        },
        {
            name: 'Head In The Clouds',
            singer: 'JustNgoc, Rion',
            path: './mp3/Head-In-The-Clouds-JustNgoc-Rion.mp3',
            image: './img/head-in-the-clouds.jfif'
        },
        {
            name: 'Late Night Talking',
            singer: 'Harry Styles',
            path: './mp3/Late-Night-Talking-Harry-Styles.mp3',
            image: './img/Harry_Styles_-_Late_Night_Talking.png'
        },
        {
            name: 'Living Hell',
            singer: 'Bella Poarch',
            path: './mp3/Living-Hell-Bella-Poarch.mp3',
            image: './img/Living-hell.jfif'
        },
        {
            name: 'Old Love',
            singer: 'Yuri, Putri Dahlia',
            path: './mp3/Old-Love-Yuji-Putri-Dahlia.mp3',
            image: './img/old-love.jfif'
        },
        {
            name: 'Star Walkin\'',
            singer: 'Lil Nas X',
            path: './mp3/Star-Walkin-Lil-Nas-X.mp3',
            image: './img/star-walking.jfif'
        },
        {
            name: 'That\'s Hilarious',
            singer: 'Charlie Puth',
            path: './mp3/That\'s-Hilarious-Charlie-Puth.mp3',
            image: './img/thats-hilarious.jfif'
        },
        {
            name: 'When I Get Old',
            singer: 'Christopher, Chung Ha',
            path: './mp3/when-i-get-old-Christopher-chung-ha.mp3',
            image: './img/when-i-get-old.jfif'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
        // console.log(app)    

    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        const cdThumbAnimate = cdThumb.animate([{transform: 'rotate(360deg)'}],{
            duration: 10000,
            iterations: Infinity
        })
        // console.log(cdThumbAnimate)
        cdThumbAnimate.pause()


        document.onscroll = function(e) { 
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        audio.ontimeupdate = function() {
           if (audio.duration) {
                progress.value = audio.currentTime / audio.duration * 100
           }
        }
        progress.oninput = function() {
            const seekTime = this.value * audio.duration /100
            audio.currentTime =  seekTime
        }
        nextBtn.onclick = function() {
            if (_this.isRandom) {
               _this.playRandomSong()
            } else (
                _this.nextSong()
            )
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            this.classList.toggle('active',_this.isRandom)
        }
        repeatBtn.onclick = function() {
            _this.isRepeated = !_this.isRepeated
            _this.setConfig('isRepeated', _this.isRepeated)
            this.classList.toggle('active',_this.isRepeated)
        }
        audio.onended = function() {
            if (_this.isRepeated) {
                audio.play()
            } else{
                nextBtn.click()
            }
        }
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode && !e.target.closest('.option')) {
                _this.currentIndex = Number.parseInt(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }


    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },300)
        
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeated = this.config.isRepeated
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeated)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.round(Math.random() * (this.songs.length - 1)) 
        } while ( newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()

    },
    start: function() {
        this.defineProperties()
        this.handleEvents()

        this.loadConfig()
        this.loadCurrentSong()
        this.render()
        
    },


}

app.start()

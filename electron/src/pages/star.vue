<style lang='postcss' scoped>
.container {
  max-width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;

  .title {
    @apply pt-12 pl-6 pr-6 pb-4;
    font-size: 20px;
    background: #f1f1f1;
  }

  .content {
    @apply pt-10 pb-2 pl-6 pr-6;
    align-items: stretch;
    overflow: hidden;

    .input {

      textarea {
        line-height: 1.5;
        resize: none;
        width: 100%;
        height: 100%
      }
      textarea:focus { 
        outline: none !important;
      }
    }

    .divider {
      width: 1px;
      background: #EFEFEF;
      border-radius: 2px;
    }

    .result {
      overflow: scroll;
    }
  }

  .footer {
    @apply pb-3 pl-4 pr-4;
    font-size: 14px;
    color: #A6A6A6;
    text-align: end;

    .left {
      @apply pl-2;
      justify-content: space-between;
      align-items: center;
    }

    .right {
      @apply pl-8 pr-2;
      justify-content: flex-end;
      align-items: center;

      .toast {
        opacity: 0.5;
      }
      .copy {
        @apply pt-1 pb-1 pl-1 pr-1;
        cursor: pointer;
      }
      .fade-enter-active {
        transition: opacity .1s;
      }
      .fade-leave-active {
        transition: opacity .5s;
      }
      .fade-enter, .fade-leave-to {
        opacity: 0;
      }
    }
  }

  .draggable {
    @apply absolute left-0 right-0 top-0;
    height: 26px;
  }
  .is-win .draggable {
    display: none;
  }
}
</style>
<template>
  <div class='container flex'>
    <div class='title' v-if='flase'>{{ title }}</div>
    
    <div class='content flex-1 flex'>
      <div class='input flex-1 pr-6'>
        <textarea v-model='message' placeholder='입력해주세요.'></textarea>
      </div>
      <div class='divider'></div>
      <div class='result flex-1 pl-6' ref='result' v-html='result'></div>
    </div>

    <div class='footer flex'>
      <div class='left flex-1 flex'>
        <div class='copyright'></div>
        <div class='count'>{{ contentSize }}</div>
      </div>
      <div class='right flex-1 flex'>
        <transition name='fade'>
          <div class='toast pr-2' v-if='successCopy'>🐾</div>
        </transition>
        <div class='copy' @click='copyResult'>복사하기</div>
      </div>
    </div>

    <div class='draggable region-drag'></div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from 'vue-property-decorator'
import { debounce } from '~/packages/utils'
import { SpellError } from '../interfaces/spell'
import { stringify } from 'qs'

@Component({
  components: {
  },
})
export default class PagePlayground extends Vue {
  
  title: string = ''
  message: string | null = null
  result: string | null = null
  contentSize: string | null = '0/300'
  successCopy: boolean = false

  checkSpellDebounce: any

  mounted() {
    this.checkSpellDebounce = debounce((value: string) => { this.checkSpell(value) }, 777)
    this.title = process.platform === 'darwin' ? '' : ''
  }

  // 괜찮아궨찮아고ㅒㄴ찮아
  
  /*
  그렇군요 
  해피해킹 키보드는 부드러워요. 정말로 부드럽구요.
  부드러운 것은 역시나 프렌치 토스트 
  프렌치 토스트는 맛있다. 
  이히히히
  신난다
  프렌치 토스트!!!!!!!!!!!!!!!!!
  바다 가서 커피 마시면 정말 맛있 겠지. 
  저 색깔 이쁘다. 
  민트색 좋아
  초록색도 좋아 
  다 좋아 
  나는 이제 자러 갈거야
  코오
  자야지 
  히융..
  한시간 그러면 3:30까지 하실 예정이로군요. 이렇게 오타가 많이 나는데 도대체 어떻게 문서를 잘 작성할 수가 있지요? 이 오타의 수를 고려헸을때 해피해킹이 과연 나에게 가장 적합한 키보드일지 다시한번 묻떼 됩니다. 그리고 지금 이 맞춤법 검사는 잘 진행되고 있는걸ㅇ Z ㅏㄷㅇㅁ럼ㄴ어롬ㄴ이ㅓ러  까요? 아닌 것 같은 데 안뇽! 모카 잘 자 오늘 고마웠어!-ㅏㅓ밍ㄴㅁ;ㅇㅇ 
   */
  checkSpell(message: string) {
    let url = 'https://speller.cs.pusan.ac.kr/results'
    message = message.split(/\r?\n/).map(line => line.trim()).join('\r\n')

    fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: stringify({
        text1: message,
      }, {
        format: 'RFC1738',
      }),
    })
    .then(async (res) => {
      let data = await res.text()
      let result = JSON.parse(data.split(/data\s=\s/i)[1].split(/;(\n|\r)\s+pageIdx/)[0])[0]
      console.log(result)
      
      let newMessage = result.str
      let errorInfos = result.errInfo as Array<SpellError>
      
      let offset = 0

      errorInfos.reverse().forEach((error: SpellError) => {
        let errorMethod = error.correctMethod
        
        let start = error.start
        let end = error.end
        
        let oldWord = error.orgStr
        let newWord = error.candWord.split('|')[0]

        let pre = newMessage.slice(0, start)
        let post = newMessage.slice(end, newMessage.length)

        let color = 'blue'
        if (errorMethod == 2) {
          color = 'red'
        } else if (errorMethod == 3) {
          color = 'lightbrown'
        } else if (errorMethod == 4) {
          color = 'green'
        } else if (errorMethod == 6) {
          color = 'darkmagenta'
        }

        let preCss = `<b><font color=${color}>`
        let postCss = '</font></b>'
        newMessage = pre + preCss + newWord + postCss + post
      })
      this.result = newMessage.replace(/\r\n?/g, '<br />')
    })
    .catch((e) => {
      this.result = `<font color=green>${message.replace(/\r\n?/g, '<br />')}</font>`
    })
  }

  copyResult() {
    let range = document.createRange();
    range.selectNode(this.$refs.result as Element)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
    console.log(range)
    document.execCommand("copy")
    
    this.successCopy = true
    setTimeout(() => {
      this.successCopy = false
    }, 2000)
  }

  @Watch('message')
  onChangeMessage(value: string | null) {
    this.checkSpellDebounce(value)
    this.contentSize = `${value?.length}/300`
  }
}
</script>

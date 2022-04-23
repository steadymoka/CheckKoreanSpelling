import axios from 'axios'
import { Query, Mutation, GraphQLObject, GraphityResolver } from 'graphity'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { Parser } from 'htmlparser2'
import { stringify } from 'qs'

import { Home } from '../entities/Home'
import { SpellError } from '../interfaces/types'

@GraphityResolver(() => Home)
export class HomeResolver {

  @Query({
    returns: () => GraphQLNonNull(GraphQLString),
  })
  public version(): string {
    return require('../package.json').version // eslint-disable-line import/no-unresolved,@typescript-eslint/no-require-imports
  }

  @Mutation({
    input: {
      contents: { type: GraphQLString },
    },
    returns: () => GraphQLObject({
      name: 'CheckSpellingResponse',
      fields: {
        textToCopy: GraphQLNonNull(GraphQLString),
        textToDisplay: GraphQLNonNull(GraphQLString),
      },
    }),
  })
  async checkSpelling(parent: null, input: { contents?: string | null }) {
    const url = 'http://speller.cs.pusan.ac.kr/results'
    let contents = (input.contents ?? "").split(/\r?\n/).map(line => line.trim()).join('\r\n')

    const reg = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g // eslint-disable-line
    let find
    let index = 0
    const relaceTemp: { temp: string, real: string }[] = []
    while ((find = reg.exec(contents)) !== null) {
      console.log(`find: ${find}, index: ${index}`)

      contents = contents.replace(`${find}`, `[{${index}${index}}]`)
      relaceTemp.push({ temp: `[{${index}${index}}]`, real: `${find}` })
      index++
    }

    const body = stringify({
      text1: contents,
    }, {
      format: 'RFC1738',
    })
    const { data } = await axios.post(url, body)

    const result = JSON.parse(data.split(/data\s=\s/i)[1].split(/;(\n|\r)\s+pageIdx/)[0])[0]

    let newMessage = result.str
    const errorInfos = result.errInfo as SpellError[]

    errorInfos.reverse().forEach((error: SpellError) => {
      const errorMethod = error.correctMethod

      const start = error.start
      const end = error.end

      const newWord = error.candWord.split('|')[0]

      const pre = newMessage.slice(0, start)
      const post = newMessage.slice(end, newMessage.length)

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

      const preCss = `<b><font color="${color}">`
      const postCss = '</font></b>'
      newMessage = pre + preCss + newWord + postCss + post
    })

    relaceTemp.forEach((tempObject) => {
      newMessage = newMessage.replace(tempObject.temp, tempObject.real)
    })
    let textToCopy = ''
    const textToDisplay = newMessage.replace(/\r\n?/g, '<br />')
    const parser = new Parser({
      ontext(text) {
        textToCopy += text
      },
      onclosetag(tagname) {
        if (tagname === 'br') {
          textToCopy += '\n'
        }
      },
    })
    parser.write(textToDisplay)
    parser.end()
    return {
      textToCopy,
      textToDisplay,
    }
  }

}

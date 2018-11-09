/* eslint-disable spaced-comment */
/*<remove trigger="prod">*/
import { test } from '../../lib/api-mock'
/*</remove>*/

/*<jdists trigger="prod">
import { test } from '../../lib/api'
</jdists>*/
/* eslint-disable spaced-comment */

Page({
  onClickTitle () {
    test(1, 2).then((result) => {
      console.log(result)
    })
  }
})

// import { onMounted, nextTick, ref, reactive  } from 'vue'
// export default function() {
//   const _setFontSize = () => {
//     if (document.body.offsetWidth) {
//       const res = document.body.offsetWidth / fullWidth
//       let style = { ...emStyle }
//       style['transform'] = `scale(${res})`
//       style['transformOrigin'] = 'left top'
//       emStyle = style
//       // return emStyle
//     }
//   }
//   // onMounted(() => {
//   //   _setFontSize(self_Style, self_width)
//   //   window.addEventListener('resize', () => {
//   //     nextTick(() => {
//   //       _setFontSize(self_Style, self_width)
//   //     })
//   //   })
//   // })
//   return {
//     _setFontSize
//   }
// }
export const _setFontSize = () => {
  if (document.body.offsetWidth) {
    const res = document.body.offsetWidth / fullWidth
    let style = { ...emStyle }
    style['transform'] = `scale(${res})`
    style['transformOrigin'] = 'left top'
    emStyle = style
    // return emStyle
  }
}
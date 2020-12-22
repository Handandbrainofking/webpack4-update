export default function (amount) {
  let numVal = Number(amount) || 0
  return numVal.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}

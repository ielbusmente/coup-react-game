/**comment */
export default function shuffleArray(array) {
  console.log(`dati: ${array}`);
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  console.log(`ngayon: ${array}`);
  return array;
}

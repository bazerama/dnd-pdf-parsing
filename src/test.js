const date = new Date();
const localDate = date.toLocaleString('en-AU');
console.dir(localDate);
const isoLocalDate = new Date(localDate).toISOString();
// console.dir(date.getTime());
console.dir(isoLocalDate);

let target = 115;

setInterval(() => {
    process.stdout.write('\rTime remaining: ' + target + ' seconds');
    target--;
}, 1000);

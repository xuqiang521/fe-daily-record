var args = process.argv.slice(2)

args.forEach(arg => {
  switch (arg) {
    case '-h':
    case '--help':
      printhelp()
      break;
  }
})

function printhelp () {
  console.log(' usage:');
  console.log(' $ AwesomeProgram <options> <file-to-awesomeify>');
  console.log(' example:');
  console.log(' $ AwesomeProgram --make-awesome not-yet.awesome');
  process.exit(0);
}
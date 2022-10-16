
import chalk from 'chalk'


export function display(msg) {
    console.log(chalk.bold.magentaBright(msg));
}

export function show(msg) {
    console.log(chalk.bold.cyanBright(msg));
}

export function success(msg) {
    console.log(chalk.bold.greenBright(msg));
}

export function warn(msg) {
    console.log(chalk.bold.yellowBright(msg));
}

export function error(msg) {
    console.log(chalk.bold.redBright(msg));
}

export function exit(msg) {
    console.log(chalk.bold.blueBright(msg));
}

export function line(simb='-', width=40) {
    display(simb.repeat(width))
}




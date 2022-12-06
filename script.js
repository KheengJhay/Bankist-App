'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
	owner: 'King Joshua',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		'2022-11-20T21:31:17.178Z',
		'2022-11-23T07:42:02.383Z',
		'2022-11-26T09:15:04.904Z',
		'2022-11-30T10:17:24.185Z',
		'2022-12-02T14:11:59.604Z',
		'2022-12-03T17:01:17.194Z',
		'2022-12-04T23:36:17.929Z',
		'2022-12-05T10:51:36.790Z',
	],
	currency: 'USD',
	locale: navigator.language, // de-DE
};

const account2 = {
	owner: 'Joseph Great',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2022-11-25T18:49:59.371Z',
		'2022-11-26T12:01:20.894Z',
		'2022-11-30T14:43:26.374Z',
		'2022-12-03T16:33:06.386Z',
		'2022-12-05T13:15:33.035Z',
		'2022-12-05T09:48:16.867Z',
		'2022-12-05T06:04:23.907Z',
		'2022-12-05T14:18:46.235Z',
	],
	currency: 'EUR',
	locale: navigator.language,
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const containerBalance = document.querySelector('.balance');
const balanceText = document.querySelector('.balance__label');
const errorMessage = document.querySelector('.error__message');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan--amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
	['USD', 'United States dollar'],
	['EUR', 'Euro'],
	['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// CREATE USERNAME (LOGIC: TAKES THE FIRST LETTER FROM THE OWNER PROPERTY  )
const createUsername = function (accs) {
	accs.forEach(function (acc) {
		acc.username = acc.owner
			.toLowerCase()
			.split(' ')
			.map(name => name[0])
			.join('');
	});
};
createUsername(accounts);
// IMPLEMENTING TIMER FUNCTIONALITY
const logoutTimer = function () {
	const tick = function () {
		let min = String(Math.floor(time / 60)).padStart(2, 0);
		let sec = String(Math.floor(time % 60)).padStart(2, 0);
		labelTimer.textContent = `${min}:${sec}`;
		if (time === 0) {
			clearInterval(timer);
			labelWelcome.textContent = 'Log in to get started';
			containerApp.style.opacity = 0;
			containerBalance.style.opacity = 0;
		}
		time--;
	};
	let time = 120;
	tick();
	const timer = setInterval(tick, 1000);
	return timer;
};
const updateUI = function (account) {
	displayMovements(account);
	calcPrintBalance(account);
	calcDisplayIncomeSummary(account);
};
let currentUser, timer;
let timestamp = function () {
	let timeNow = Date.now();
	let now = new Date(timeNow);
	currentUser.movementsDates.push(now.toISOString());
};
// LOGIN FUNCTIONALITY
btnLogin.addEventListener('click', function (e) {
	e.preventDefault();

	const curDate = new Date();
	const options = {
		weekday: 'long',
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	};
	const locale = navigator.language;
	console.log(locale);
	labelDate.textContent = new Intl.DateTimeFormat(currentUser?.locale, options).format(curDate);
	// console.log(currentUser.locale);
	currentUser = accounts.find(value => value.username === inputLoginUsername.value);
	// console.log(currentUser.owner);
	if (currentUser?.pin === +inputLoginPin.value) {
		labelWelcome.textContent = `Welcome, ${currentUser.owner.split(' ')[0]}`;
		containerApp.style.opacity = 100;
		containerBalance.style.opacity = 100;
		errorMessage.style.opacity = 0;
		// CLEAR LOGIN INPUT FIELDS
		inputLoginUsername.value = inputLoginPin.value = '';
		inputLoginPin.blur();
		// UPDATING UI
		updateUI(currentUser);
	} else {
		errorMessage.style.opacity = 100;
	}

	if (timer) clearInterval(timer);

	timer = logoutTimer();

	timestamp();
});
// DISPLAY CURRENT BALANCE
const calcPrintBalance = function (curAcc) {
	curAcc.balance = curAcc.movements.reduce(function (sum, cur) {
		return sum + cur;
	});
	const bal = new Intl.NumberFormat('US', {
		style: 'currency',
		currency: currentUser.currency,
	}).format(curAcc.balance);
	// console.log(bal);
	labelBalance.textContent = `${bal}`;
};

const displayMovements = function (curAcc, sort = false) {
	containerMovements.innerHTML = '';

	const movs = sort ? curAcc.movements.slice().sort((a, b) => a - b) : curAcc.movements;

	movs.forEach(function (value, i) {
		const date = new Date(curAcc.movementsDates[i]);
		// console.log(date);
		const curDate = new Date(curAcc.movementsDates[i]);
		const day = `${curDate.getDate()}`.padStart(2, 0);
		const month = `${curDate.getMonth()}`.padStart(2, 0);
		const year = curDate.getFullYear();
		let displayDate;

		const calcDatePast = (date1, date2) =>
			Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
		const curday = calcDatePast(new Date(), curDate);
		// console.log(curday);
		timestamp();
		if (curday === 0) displayDate = 'Today';
		else if (curday === 1) displayDate = 'Yesterday';
		else if (curday <= 7) displayDate = `${curday} days ago`;
		else if (curday >= 7 && curday <= 14) displayDate = `1 week ago`;
		else if (curday >= 14 && curday <= 21) displayDate = `2 weeks ago`;
		else if (curday === 21 && curday <= 30) displayDate = `4 weeks ago`;
		else if (curday === 30) displayDate = `A month ago`;
		else if (curday > 30) displayDate = `Few months ago`;
		// else {
		// 	displayDate = new Intl.DateTimeFormat('en').format(new Date());
		// }

		const bal = new Intl.NumberFormat('US', {
			style: 'currency',
			currency: currentUser.currency,
		}).format(value);
		var checkvalue = value > 0 ? 'deposit' : 'withdrawal';
		const text = `
		<div class="movements__row">
			<div class="movements__type movements__type--${checkvalue}">${i + 1}.  ${checkvalue}</div>
			<div class="movements__date">${displayDate}</div>
			<div class="movements__value">${bal}</div>
		</div>`;
		containerMovements.insertAdjacentHTML('afterbegin', text);
	});
	timestamp();
};
// DISPLAY INCOME / OUTCOME SUMMARY
const calcDisplayIncomeSummary = function (curAcc) {
	const formatCurrency = function (value) {
		const format = new Intl.NumberFormat('US', {
			style: 'currency',
			currency: currentUser.currency,
		}).format(value);
		return format;
	};
	// console.log(curAcc.movements);
	// DEPOSITS
	const incomes = curAcc.movements.filter(value => value > 0).reduce((sum, cur) => sum + cur);

	labelSumIn.textContent = `${formatCurrency(incomes)}`;

	// WITHDRAWALS
	const outgoing = curAcc.movements.filter(value => value < 0).reduce((sum, cur) => sum + cur, 0);
	labelSumOut.textContent = `${formatCurrency(Math.abs(outgoing))}`;
	// INTERESTS
	const interest = curAcc.movements
		.filter(value => value > 0)
		.map(value => (value * curAcc.interestRate) / 100)
		.filter((value, i, arr) => value >= 1)
		.reduce((cur, sum) => cur + sum);
	labelSumInterest.textContent = `${formatCurrency(interest)}`;
};
// FUNCTION TO UPDATE UI

btnLoan.addEventListener('click', function (e) {
	e.preventDefault();
	const amount = Math.floor(+inputLoanAmount.value);
	if (amount > 0 && currentUser.movements.some(value => value >= amount * 0.1)) {
		// ADD APPROVED LOAN TO MOVEMENTS
		setTimeout(function () {
			currentUser.movements.push(amount);
			timestamp();
			// UPDATE UI
			updateUI(currentUser);
		}, 3000);
	}
	// RESET TIMER
	clearInterval(timer);
	timer = logoutTimer();
	// CLEAR LOAN INPUT FIELDS
	inputLoanAmount.value = '';
	inputLoanAmount.blur();
});

btnTransfer.addEventListener('click', function (e) {
	e.preventDefault();
	// CLEAR TRANSFER INPUT FIELDS
	const amount = +inputTransferAmount.value;
	const reciverAcc = accounts.find(value => value.username === inputTransferTo.value);
	if (
		amount > 0 &&
		reciverAcc &&
		currentUser?.balance >= amount &&
		reciverAcc?.username !== currentUser.username
	) {
		currentUser.movements.push(-amount);
		reciverAcc.movements.push(amount);
		// console.log(reciverAcc.movements);
		timestamp();
		// console.log(reciverAcc.movementsDates);
		// RESET TIMER
		clearInterval(timer);
		timer = logoutTimer();
		// UPDATING UI
		updateUI(currentUser);
	}
	// console.log(currentUser.movements);
	inputTransferAmount.value = inputTransferTo.value = '';
	inputTransferTo.blur();
});

btnClose.addEventListener('click', function (e) {
	e.preventDefault();
	if (
		inputCloseUsername.value === currentUser.username &&
		+inputClosePin.value === currentUser.pin
	) {
		const index = accounts.findIndex(value => value.username === currentUser.username);
		// console.log(index);
		// DELETE CURRENT USER ACCOUNT
		accounts.splice(index, 1);
		// LOG CURRENT USER OUT(SETS THE OPACITY BACK TO ZERO)
		containerApp.style.opacity = 0;
		containerBalance.style.opacity = 0;
		labelWelcome.textContent = 'Log in to get started';
	}
	// CLEAR CLOSE ACCOUNT INPUT FIELDS
	inputCloseUsername.value = inputClosePin.value = '';
	inputCloseUsername.blur();
});
let sorted = false;
btnSort.addEventListener('click', function () {
	// UPDATING UI
	displayMovements(currentUser, !sorted);
	sorted = !sorted;
});
// logoutUser();

import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('button');
    const clearBtn = document.getElementById('clear');
    const equalsBtn = document.getElementById('equals');

    let currentInput = '';
    let currentOperator = '';
    let firstOperand = null;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (button.classList.contains('num')) {
                currentInput += value;
                display.value = currentInput;
            } else if (button.classList.contains('op')) {
                if (firstOperand === null) {
                    firstOperand = parseFloat(currentInput);
                    currentOperator = value;
                    currentInput = '';
                } else {
                    calculate();
                    currentOperator = value;
                }
            }
        });
    });

    clearBtn.addEventListener('click', () => {
        currentInput = '';
        currentOperator = '';
        firstOperand = null;
        display.value = '';
    });

    equalsBtn.addEventListener('click', calculate);

    async function calculate() {
        if (firstOperand !== null && currentOperator && currentInput) {
            const secondOperand = parseFloat(currentInput);
            let result;

            try {
                switch (currentOperator) {
                    case '+':
                        result = await backend.add(firstOperand, secondOperand);
                        break;
                    case '-':
                        result = await backend.subtract(firstOperand, secondOperand);
                        break;
                    case '*':
                        result = await backend.multiply(firstOperand, secondOperand);
                        break;
                    case '/':
                        const divisionResult = await backend.divide(firstOperand, secondOperand);
                        if (divisionResult === null) {
                            throw new Error('Division by zero');
                        }
                        result = divisionResult;
                        break;
                }

                display.value = result;
                firstOperand = result;
                currentInput = '';
            } catch (error) {
                display.value = 'Error';
                firstOperand = null;
                currentInput = '';
            }

            currentOperator = '';
        }
    }
});

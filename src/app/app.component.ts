import { Component, HostListener, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    displayValue: string = '0';
    currentOperator: string | null = null;
    firstOperand: string | null = null;
    secondOperand: string | null = null;
    waitingForSecondOperand: boolean = false;
    currentExpression: string = '';
    themes: string[] = ['theme-1', 'theme-2', 'theme-3']; // Theme array
    operators: string[] = ['+', '-', '/', 'x'];
    currentThemeIndex: number = 0;

    buttons = [
        { label: '7' },
        { label: '8' },
        { label: '9' },
        { label: 'DEL' },
        { label: '4' },
        { label: '5' },
        { label: '6' },
        { label: '+' },
        { label: '1' },
        { label: '2' },
        { label: '3' },
        { label: '-' },
        { label: '.' },
        { label: '0' },
        { label: '/' },
        { label: 'x' },
    ];

    @HostListener('window:keydown', ['$event'])
    handleKeyboardInput({ key, code }: KeyboardEvent) {
        // Allow digits, decimal point, operators, and Enter (for equals)
        if(code === 'Space') return;
        if (!isNaN(Number(key)) || key === '.') {
            this.inputDigit(key);
        } else if (this.operators.includes(key) || key === '*') {
            this.inputOperator(key === '*' ? 'x' : key); // Convert '*' to 'x'
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (key === 'Backspace') {
            this.delete();
        } else if (key === 'Escape') this.reset();
    }

    inputOperator(operator: string) {
        // Avoid consecutive operators
        if (
            this.currentExpression === '' ||
            this.operators.includes(this.currentExpression.slice(-1))
        ) return;

        // Add operator to the current expression
        this.currentExpression += `${operator}`;
        this.displayValue += `${operator}`;
    }

    // Handle button click (numbers and operators)
    handleButtonClick(button: { label: string }) {
        const { label } = button;

        if (!isNaN(Number(label))) {
            this.inputDigit(label);
        } else if (label === '.') {
            this.inputDecimal(label);
        } else if (label === 'DEL') {
            this.delete();
        } else {
            this.handleOperator(label);
        }
    }

    ngOnInit(): void {
        this.setTheme(this.themes[this.currentThemeIndex]);
    }

    // Handle digit input
    inputDigit(digit: string) {
        if (this.waitingForSecondOperand) {
            this.displayValue += digit;
            this.secondOperand = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue =
                this.displayValue === '0' ? digit : this.displayValue + digit;
            // this.secondOperand = digit;
        }
        this.currentExpression += digit;
    }

    // Handle decimal input
    inputDecimal(dot: string) {
        if (this.displayValue.includes('.')) return;
        this.displayValue += dot;
    }

    // Handle operators
    handleOperator(nextOperator: string) {
        this.displayValue += nextOperator;

        if (this.firstOperand === null) {
            this.firstOperand = this.displayValue;
        }
        this.currentExpression += nextOperator;
        this.currentOperator = nextOperator;
        this.waitingForSecondOperand = true;
    }

    // Calculate the result based on the operator
    calculate() {
        try {
            const expression = this.currentExpression.replace(/x/g, '*');
            this.currentExpression = this.displayValue = String(eval(expression));
        } catch (error) {
            this.displayValue = "Error";
            console.log({error});
        }
    }

    // Reset the calculator
    reset() {
        this.displayValue = '0';
        this.currentOperator = null;
        this.firstOperand = null;
        this.currentExpression = '';
        this.waitingForSecondOperand = false;
    }

    // Delete last digit
    delete() {
        this.displayValue = this.displayValue.slice(0, -1) || '0';
        this.currentExpression = this.currentExpression.slice(0, -1) || '';
    }

    // Cycle through the themes
    toggleTheme() {
        this.currentThemeIndex =
            (this.currentThemeIndex + 1) % this.themes.length;
        this.setTheme(this.themes[this.currentThemeIndex]);
    }

    setTheme(theme: string) {
        document.body.className = ''; // Reset previous theme class
        document.body.classList.add(theme); // Apply new theme
    }

    get togglePositionClass() {
        return `position-${this.currentThemeIndex}`;
    }
}

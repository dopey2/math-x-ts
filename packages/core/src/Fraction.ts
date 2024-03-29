import MathNode, { MathNodeType } from "./MathNode";
import Constant from "./Constant";
import Add from "./Add";
import Multiply from "./Multiply";
import Subtract from "./Subtract";
import Utils from "./utils";
import Divide from "./Divide";


export interface ToFraction {
    toFraction: () => Fraction;
}

/**
 * Represent fractions as math node.
 */
export default class Fraction extends MathNode implements ToFraction {
    type = MathNodeType.Fraction;

    /**
     * A fraction is considered as atomic if its results is a Floating number eg: 5 / 3.
     */
    isAtomic = false;

    private readonly n: MathNode; // numerator up
    private readonly d: MathNode; // denominator -> down

    /**
     * Override an operator.
     *
     * @param {MathNodeType} type The type of the operation.
     * @returns {undefined | (type: MathNodeType) => MathNode} A function that override the operator.
     */
    override = (type: MathNodeType) => {
        return {
            [MathNodeType.Add]: this.add.bind(this),
            [MathNodeType.Subtract]: this.subtract.bind(this),
            [MathNodeType.Multiply]: this.multiply.bind(this),
            [MathNodeType.Divide]: this.divide.bind(this),
        }[type.toString()];
    };
    /**
     * @param {MathNode} n The numerator, (the number at the top).
     * @param {MathNode} d The denominator, (the number on the bottom).
     */
    constructor(n: MathNode, d: MathNode) {
        super();

        this.n = n;
        this.d = d;

        if (this.n instanceof Constant && this.d instanceof Constant) {
            const NUMERATOR = this.n.value;
            const DENOMINATOR = this.d.value;
            const MODULO = NUMERATOR % DENOMINATOR;
            this.isAtomic = MODULO !== 0;
        }
    }

    /**
     * Aim to solve a fraction with constants numerator and denominator.
     *
     * @param {MathNode} n The numerator.
     * @param {MathNode} d The denominator.
     * @returns {MathNode} The value as a math not.
     */
    private solveForConstant(n: Constant, d: Constant) {
        const NUMERATOR = n.value;
        const DENOMINATOR = d.value;
        const QUOTIENT = NUMERATOR / DENOMINATOR;

        if (QUOTIENT === Math.floor(QUOTIENT)) {
            return new Constant(QUOTIENT);
        } else {
            return new Fraction(n as MathNode, d as MathNode);
        }
    }

    /**
     * @inheritDoc
     */
    next(): MathNode {
        if (this.n instanceof Constant && this.d instanceof Constant) {
            return this.solveForConstant(this.n as Constant, this.d as Constant);
        }

        return new Fraction(this.n.next(), this.d.next());
    };

    /**
     * The functions find a common denominator for 2 fractions.
     * Useful when you want to add 2 fractions with different denominators.
     *
     * @param {Fraction} fractionA A fraction.
     * @param {Fraction} fractionB A fraction.
     * @returns {Fraction[]} An array of both fractions with new denominators.
     */
    private solveDenominatorForConstants(fractionA: Fraction, fractionB: Fraction) {
        if (fractionA.d instanceof Constant && fractionB.d instanceof Constant) {
            const DENOMINATOR_A = fractionA.d.value;
            const DENOMINATOR_B = fractionB.d.value;

            const LCM = Utils.lcm(DENOMINATOR_A, DENOMINATOR_B);
            const COMMON_A = LCM / DENOMINATOR_A;
            const COMMON_B = LCM / DENOMINATOR_B;

            const numeratorA = COMMON_A === 1
                ? fractionA.n
                : new Multiply(fractionA.n, new Constant(COMMON_A) as MathNode) as MathNode;

            const numeratorB = COMMON_B === 1
                ? fractionB.n
                : new Multiply(fractionB.n, new Constant(COMMON_B) as MathNode) as MathNode;

            const denominatorA = COMMON_A === 1
                ? new Constant(DENOMINATOR_A)
                : new Multiply(new Constant(DENOMINATOR_A) as MathNode, new Constant(COMMON_A) as MathNode) as MathNode;

            const denominatorB = COMMON_B === 1
                ? new Constant(DENOMINATOR_B)
                : new Multiply(new Constant(DENOMINATOR_B) as MathNode, new Constant(COMMON_B) as MathNode) as MathNode;

            return [
                new Fraction(numeratorA, denominatorA),
                new Fraction(numeratorB, denominatorB)
            ];
        }

        return [
            fractionA,
            fractionB
        ];
    };


    /* eslint-disable-next-line */
    add(constant: Constant): MathNode;
    /* eslint-disable-next-line */
    add(fraction: Fraction): MathNode;
    /**
     * This function override the addition operator for fractions.
     *
     * @param {Constant | Fraction} argument A math node you want to add to the fraction.
     * @returns {MathNode} A new math node.
     */
    add(argument: Constant | Fraction) {
        if(!this.n.isAtomic || !this.d.isAtomic) {
            const left = new Fraction(this.n.next(), this.d.next());
            const right = argument.isAtomic ? argument : argument.next();
            return new Add(
                left,
                right
            );
        }

        if(argument instanceof Constant) {
            if(this.n instanceof Constant && this.d instanceof Constant) {
                const next = this.solveForConstant(this.n, this.d);
                if(next instanceof Constant) {
                    return new Add(next, argument);
                }
            }

            return new Add(this, argument.toFraction());
        } else {
            if (this.d instanceof Constant && argument.d instanceof Constant) {
                if (this.d.value === argument.d.value) {
                    const addNumerator = new Add(this.n, argument.n);
                    return new Fraction(addNumerator, this.d);
                } else {
                    const [fractionA, fractionB] = this.solveDenominatorForConstants(this, argument);
                    return new Add(fractionA, fractionB);
                }
            }
        }

        return new Add(this.next(), argument.next());
    }

    /* eslint-disable-next-line */
    subtract(constant: Constant): MathNode;
    /* eslint-disable-next-line */
    subtract(fraction: Fraction): MathNode;
    /**
     * This function override the subtraction operator for fractions.
     *
     * @param {Constant | Fraction} argument A math node you want to subtract to the current fraction.
     * @returns {MathNode} A new math node.
     */
    subtract(argument: Constant | Fraction) {
        if(!this.n.isAtomic || !this.d.isAtomic) {
            const left = new Fraction(this.n.next(), this.d.next());
            const right = argument.isAtomic ? argument : argument.next();
            return new Subtract(
                left,
                right
            );
        }


        if(argument instanceof Constant) {
            if(this.n instanceof Constant && this.d instanceof Constant) {
                const next = this.solveForConstant(this.n, this.d);
                if(next instanceof Constant) {
                    return new Subtract(next, argument);
                }
            }
            return new Subtract(this, argument.toFraction());
        } else {

            if (this.d instanceof Constant && argument.d instanceof Constant) {
                if (this.d.value === argument.d.value) {
                    const subtractNumerator = new Subtract(this.n, argument.n);
                    return new Fraction(subtractNumerator, this.d);
                } else {
                    const [fractionA, fractionB] = this.solveDenominatorForConstants(this, argument);
                    return new Subtract(fractionA, fractionB);
                }
            }

        }

        return new Subtract(this.next(), argument.next());
    };

    /* eslint-disable-next-line */
    multiply(constant: Constant): MathNode;
    /* eslint-disable-next-line */
    multiply(fraction: Fraction): MathNode;
    /**
     * This function override the multiplication for fractions.
     *
     * @param {Constant | Fraction} argument A math node you want to multiply by.
     * @returns {MathNode} A new math node.
     */
    multiply(argument: Constant | Fraction): MathNode {
        if(!this.n.isAtomic || !this.d.isAtomic) {
            const left = new Fraction(this.n.next(), this.d.next());
            const right = argument.isAtomic ? argument : argument.next();
            return new Multiply(
                left,
                right
            );
        }

        if(argument instanceof Constant) {
            if(this.n instanceof Constant && this.d instanceof Constant) {
                const next = this.solveForConstant(this.n, this.d);
                if(next instanceof Constant) {
                    return new Multiply(next, argument);
                }
            }

            return new Fraction(
                new Multiply(this.n, argument),
                new Multiply(this.d, argument)
            );
        }

        if (this.d && argument && argument.d) {
            return new Fraction(
                    new Multiply(this.n, argument.n) as MathNode,
                    new Multiply(this.d, argument.d) as MathNode
            );
        }

        return new Multiply(this.next(), argument.next());
    };

    /* eslint-disable-next-line */
    divide(constant: Constant): MathNode;
    /* eslint-disable-next-line */
    divide(fraction: Fraction): MathNode;
    /**
     * This function override the division for fractions.
     *
     * @param {Constant | Fraction} argument A math node you want to divide by.
     * @returns {MathNode} A new math node.
     */
    divide(argument: Constant | Fraction): MathNode {
        if(!this.n.isAtomic || !this.d.isAtomic) {
            const left = new Fraction(this.n.next(), this.d.next());
            const right = argument.isAtomic ? argument : argument.next();
            return new Divide(
                left,
                right
            );
        }

        if(argument instanceof Constant) {
            argument = argument.toFraction();
        }

        return new Multiply(
            this,
            new Fraction(argument.d, argument.n)
        );
    }


    /**
     * Return the fraction numerator.
     *
     * @returns {MathNode} The numerator.
     */
    public getNumerator(): MathNode {
        return this.n;
    }

    /**
     * Return the fraction denominator.
     *
     * @returns {MathNode} The denominator.
     */
    public getDenominator(): MathNode {
        return this.d;
    }

    /**
     * @inheritDoc
     */
    toFraction() {
        return this;
    };

    /**
     * @inheritDoc
     */
    toJson() {
        return {
            type: this.type,
            numerator: this.n.toJson(),
            denominator: this.d.toJson(),
        };
    };

    /**
     * @inheritDoc
     */
    toString() {
        return `{${this.n.toString()}} / {${this.d.toString()}}`;
    };

    /**
     * @inheritDoc
     */
    toTex() {
        return `\\frac{${this.n.toTex()}}{${this.d.toTex()}}`;
    };

    /**
     * @inheritDoc
     */
    isEqual(mathNode: MathNode): boolean {
        // @ts-ignore
        return this.type === mathNode.type && this.n.isEqual(mathNode.n) && this.d.isEqual(mathNode.d);
    }
}

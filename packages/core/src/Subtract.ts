import MathNode, { MathNodeType } from "./MathNode";
import Constant from "./Constant";
import Add from "./Add";
import BaseOperation from "./BaseOperation";

/**
 * Represent the subtraction operation as a math node.
 */
export default class Subtract extends BaseOperation {

    /**
     * @param {MathNode} left The left node.
     * @param {MathNode} right The right node.
     */
    constructor(left: MathNode, right: MathNode) {
        super(left, right, MathNodeType.Subtract, "-");
    }

    /**
     * @inheritDoc
     */
    concreteNext(): MathNode {
        if (!this.left.isAtomic || !this.right.isAtomic) {
            const [leftNode, rightNode] = super.getConstantsFromParenthesis();

            if(leftNode instanceof Constant && rightNode instanceof Constant) {
                if(rightNode.value < 0) {
                    return new Add(leftNode, new Constant(Math.abs(rightNode.value)));
                }

                return new Constant(leftNode.value - rightNode.value);
            }

            return new Subtract(this.left.next(), this.right.next());
        }

        return this;
    };

    /**
     * Return the subtraction of left and right.
     *
     * @param {number} left The left operand.
     * @param {number} right The right operand.
     * @returns {number} The difference result
     * .
     */
    operation(left: number, right: number): number {
        return left - right;
    }
}

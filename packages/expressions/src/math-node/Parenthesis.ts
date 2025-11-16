import MathNode, { MathNodeType } from "./MathNode";
import Constant from "./Constant";
import Fraction from "./Fraction";

/**
 * Represent the parenthesis as a math node.
 */
export default class Parenthesis extends MathNode {
    type = MathNodeType.Parenthesis;
    isAtomic = false;

    public readonly content: MathNode;

    /**
     * @param {MathNode} content The content of the parenthesis.
     */
    constructor(content: MathNode) {
        super();
        this.content = content;
    }

    /**
     * @inheritDoc
     */
    next(args?: any): MathNode {
        const isNegative = args?.isNegative ?? false;
        if(this.content.type === MathNodeType.Constant) {
            return this.content as MathNode;
        } else {
            const solvedParenthesis = this.content.next();
            if(solvedParenthesis instanceof Constant && !isNegative || solvedParenthesis instanceof Fraction) {
                return solvedParenthesis;
            }
            return new Parenthesis(solvedParenthesis);
        }
    };

    /**
     * @inheritDoc
     */
    toJson() {
        return {
            type: this.type,
            content: this.content.toJson(),
        };
    };

    /**
     * @inheritDoc
     */
    toString() {
        return `(${this.content.toString()})`;
    };

    /**
     * @inheritDoc
     */
    toTex() {
        return `(${this.content.toTex()})`;
    };

    /**
     * @inheritDoc
     */
    isEqual(mathNode: MathNode): boolean {
        return (
            this.type === mathNode.type
            && mathNode instanceof Parenthesis
            && this.content.isEqual(mathNode.content)
        );
    }
}

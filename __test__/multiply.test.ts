import Constant from "../src/math-node/Constant";
import Multiply from "../src/math-node/Multiply";
import {MathNodeType} from "../src/math-node/MathNode";

describe("Adding constant", () => {
    it("1 * 1", () => {
        const mathNode = new Multiply(new Constant(1), new Constant(1));

        expect(mathNode.type).toBe(MathNodeType.Multiply);
        expect(mathNode.isAtomic).toBe(false);

        expect(mathNode.toString()).toBe("1 * 1");
        expect(mathNode.toTex()).toBe("1 * 1");
        expect(mathNode.toJson()).toEqual({
            type: MathNodeType.Multiply,
            left: {
                type: MathNodeType.Constant,
                value: 1
            },
            right: {
                type: MathNodeType.Constant,
                value: 1
            }
        })

        const solved = mathNode.next();
        expect(solved).toBeDefined();
        expect(solved?.isAtomic).toBe(true);

        expect(solved.type).toBe(MathNodeType.Constant);
        expect(solved.value).toBe(1);
        expect(solved.toString()).toBe("1");
    });

    it("3 * 2", () => {
        const expression = new Multiply(new Constant(3), new Constant(2));
        const solved = expression.next();

        expect(solved).toBeDefined();
        expect(solved?.isAtomic).toBe(true);

        expect(solved.type).toBe(MathNodeType.Constant);
        expect(solved.value).toBe(6);
        expect(solved.toString()).toBe("6");
    });
});
import { Constant, Divide, MathNodeType } from "@math-x-ts/core/src";
import { parse } from '@math-x-ts/parser/src';


describe("Divide", () => {
    it("4 : 2", () => {
        const mathNode = parse("4 : 2");

        expect(mathNode.type).toBe(MathNodeType.Divide);
        expect(mathNode.isAtomic).toBe(false);

        expect(mathNode.toString()).toBe("4 : 2");
        expect(mathNode.toTex()).toBe("4 : 2");
        expect(mathNode.toJson()).toEqual({
            type: MathNodeType.Divide,
            left: {
                type: MathNodeType.Constant,
                value: 4,
            },
            right: {
                type: MathNodeType.Constant,
                value: 2,
            },
        });

        const solved = mathNode.next();
        expect(solved).toBeDefined();
        expect(solved?.isAtomic).toBe(true);
        expect(solved.type).toBe(MathNodeType.Constant);
        expect(solved.value).toBe(2);
        expect(solved.toString()).toBe("2");
    });


    it("3 / 6 : 2 / 8", () => {
        const mathNode = parse("3 / 6 : 2 / 8");
        const mathNode2 = mathNode.next();
        const mathNode3 = mathNode2.next();
        const mathNode4 = mathNode3.next();
        const mathNode5 = mathNode4.next();

        expect(mathNode.toString()).toBe("{3} / {6} : {2} / {8}");
        expect(mathNode2.toString()).toBe("{3} / {6} * {8} / {2}");
        expect(mathNode3.toString()).toBe("{3 * 8} / {6 * 2}");
        expect(mathNode4.toString()).toBe("{24} / {12}");
        expect(mathNode5.toString()).toBe("2");
        expect(mathNode5.value).toBe(2);
    });

    it("4 : 2 isEqual 4 : 2 should be true", () => {
        const mathNode1 = new Divide(new Constant(4), new Constant(2));
        const mathNode2 = parse("4 : 2");
        expect(mathNode1.isEqual(mathNode2)).toBe(true)
    });

    it("4 : 2 isEqual 4 : 3 should be false", () => {
        const mathNode1 = new Divide(new Constant(4), new Constant(2));
        const mathNode2 = parse("4 : 3");
        expect(mathNode1.isEqual(mathNode2)).toBe(false)
    });
});
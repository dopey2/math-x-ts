Feature: Step by step
  Check step by step solution for the following expressions

  Scenario: Expression "2 + 3 * 4"
    Given the expression "2 + 3 * 4"
    When all steps are solved
    Then step 0 should be "2 + 3 * 4"
    Then step 1 should be "2 + 12"
    Then step 2 should be "14"
# Backend testing

## Guidelines

This is just a set of things to keep in mind while testing your backend. They're not written in stone but rather act like good rules of thumb:

* _Don't test the implementation, test the interface_ : Your tests should not break every time you change something in your code if you haven't changed how it was used. This is important as it allows you refactor your code with peace of mind as long as you respect the contract set by your interface (input/output).

* _Your tests should give you confidence that your code is working_ : if that's not the case then they're not good tests.


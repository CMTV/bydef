---
{
    "title": "Работа с высказывательными формами",
    "difficulty": "easy"
}
---

# Задача

Для каждой из высказывательных форм ниже найдите такие значения переменных, чтобы при подстановке получились истинные высказывания, и такие, чтобы получились ложные.

1. $p(x) =$ "$(-1)^x = 1$"
2. $q(x,y) =$ "$-xy > 0$"
3. $t(x,y,z) =$ "$x$ и $y$ и $z$ — правда"

# Ответ

1. $|p(2)| = 1$ (подойдет любое четное число) и $|p(1)| = 0$ (подойдет любое нечетное число)
2. $|q(2,-3)| = 1$ (подойдут любые числа разных знаков) и $|q(2,3)| = 0$ (подойдут любые числа одного знака)

Для получения истинного высказывания из третьей высказывательной формы достаточно, чтобы три переменных были истинными высказываниями:<br>
$x =$ "Снег холодный". $y =$ "$3+2=5$". $z =$ "Москва — столица России". Тогда $|t(x,y,z)| = 1$.

Для получения ложного высказывания из третьей высказывательной формы достаточно, чтобы хотя бы одна из переменных оказалась ложной:<br>
$x =$ "Снег теплый". $y =$ "$3+2=5$". $z =$ "Москва — столица России". Тогда $|t(x,y,z)| = 0$.

#
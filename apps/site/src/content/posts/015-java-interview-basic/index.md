---
title: "Java面试|基础"
description: ""
pubDatetime: 2026-11-23T10:00:00+08:00
series: Java面试
tags: [java]
---

## 概念

> 了解 Java 的特点、优劣以及和其他语言的区别， JVM、JDK、JRE 三者的概念及关系，理解 Java 的参数传递（值传递）。

### Java的特点

#### 平台无关性

**Java 编译器把源代码编译为字节码（`bytecode`）`.class` 文件，而字节码可以在任何安装 JVM 的操作系统上运行**。 换言之，Java 支持跨平台，主要依赖于 JVM，通过 JVM 这一“中间层”实现了“一次编译，到处运行”。

需要注意：跨平台是 Java，不是 JVM。不同平台要安装不同版本的 JVM。

![java](https://cdn.xiaolincoding.com//picgo/1766932182349-87bbbed5-20b8-4273-9611-16a27d5e0895.png)

#### 面向对象

Java 严格面向对象编程。OOP 使得代码更易维护与重用，包括：类、对象、多态、抽象与封装。

#### 内存管理

Java 有**垃圾回收机制**，自动管类内存与回收不再使用的对象，从而减少内存泄漏与其他内存问题。

### Java 的优劣

优势：

1. 跨平台
2. OOP
3. 内存管理
4. 多线程支持
5. **强大的生态系统**，如：Spring生态、Hibernate，还有其他各种工具和库
6. 稳定性，版本更新注意向后兼容

劣势：

1. 性能，对比于：Cpp/Rust/Go
2. 语法繁琐，代码不够简洁，代码量大，拖慢开发节奏
3. 内存消耗，JVM本身占内存
4. 严格的面向对象

### JVM，JDK，JRE

![jdk-jre-jvm](https://cdn.xiaolincoding.com//picgo/image-20240725230247664.png)

#### JVM

Java 虚拟机，主要工作是解释自己的指令集（即字节码）并映射到本地的CPU指令集和OS的系统调用。

是**Java 程序运行的环境**。负责将 Java 字节码解释或编译生成机器码，执行程序。提供了内存管理、垃圾回收、安全性等功能，使 Java 具备跨平台特性。

#### JDK

Java 开发工具包。包含：JVM、编译器（javac）、调试器（jdb）等开发工具，以及一系列类库（如：Java标准库及开发工具库）。**JDK 提供开发、编译、调试和运行 Java 程序所需的全部工具与环境**。

#### JRE

Java 运行时环境，**Java 程序运行所需的最小环境**。包含：JVM 和一组 Java 类库，以支持 Java 程序运行。JRE 不包含开发工具，只提供运行所需的环境。

### Java 语言的执行方式（编译&解释）

![java执行](https://cdn.xiaolincoding.com//picgo/1715928000183-44fc6130-8abc-4f0b-8f6d-79de0ab09509.webp)

**编译**：Java 源代码先被 `javac` 编译为平台无关的字节码（`.class`）文件，这一步发生在程序运行之前。

**解释 / JIT**：JVM 启动后由解释器逐条解释执行字节码；同时 JVM 通过方法调用计数器和回边计数器识别热点代码，达到阈值后由 JIT 编译为本地机器码并缓存到 Code Cache 中，后续执行直接走机器码。

#### 编译型语言与解释性语言的区别

| 对比维度 | 编译型语言                                                   | 解释型语言                                                   |
| :------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 执行原理 | 运行前，**一次性把全部源代码编译成目标平台机器码**，生成独立可执行文件 | 运行时，**解释器逐行读取、翻译并执行源代码**，一般不生成独立可执行文件 |
| 执行速度 | 快，直接执行机器码                                           | 相对较慢，边解释边执行                                       |
| 跨平台性 | 差，编译产物绑定目标硬件 / 系统平台                          | 好，只要对应平台有解释器就可以运行                           |
| 典型代表 | C、C++                                                       | Python、JavaScript                                           |

> 注：**Java 属于混合模式，先编译为字节码，再由 JVM 解释 / JIT 执行**

### Java 的参数传递

Java 参数传递只有**值传递**，不存在真正的“引用传递”。

**值传递（Pass by Value）：传递实际值的副本，适用于基本数据类型**（`int`、`char`等），修改方法内的参数副本，不影响原变量。

```java title="基本数据类型"
public static void main(String[] args) {
    int num = 10;
    changeValue(num);
    System.out.println(num); // 输出 10（原变量未被修改）
}

public static void changeValue(int a) {
    a = 20; // 仅修改副本
}
```

![Java值传递基本类型](./java-pass-by-value-01.excalidraw)

Java 引用传递的误解：本质依旧为值传递。

**对于对象（引用类型），传递对象引用的副本（不是对象本身，是对象的地址值）**。两个引用（原引用与副本）指向同一个对象。因此，通过副本修改对象，会影响原对象。当然，修改副本的指向（如重新赋值），不会影响原引用的指向。

```java title="引用类型"
public class Person {
    String name;
    Person(String name) { this.name = name; }
}

public static void main(String[] args) {
    Person p = new Person("Alice");
    changeName(p);
    System.out.println(p.name); // 输出 "Bob"（对象内部被修改）
    
    changeReference(p);
    System.out.println(p.name); // 仍输出 "Bob"（原引用指向未变）
}

// 修改对象内部数据
public static void changeName(Person obj) {
    obj.name = "Bob"; // 副本和原引用指向同一个对象
}

// 修改副本的指向（不影响原引用）
public static void changeReference(Person obj) {
    obj = new Person("Charlie"); // 副本指向新对象，原引用仍指向旧对象
}
```

![Java引用类型值传递](./java-pass-by-value-02.excalidraw)

简而言之，Java 的参数传递为**值传递**：

- **基本类型传递“值的副本”，修改副本不影响原值；**

- **引用类型传递“引用的副本”，通过副本可修改对象内容，但无法改变原引用的指向。**

## 数据类型

> 数据类型，类型转换的方式与问题，int与long，BigDecimal与double，装箱与拆箱，Integer与int，Integer缓存

![数据类型](https://cdn.xiaolincoding.com//picgo/1715930632378-7f03a5ae-3364-41d4-88a8-428997d543dd.png)

### 八个基本数据类型

| 数据类型  | 占用大小（字节）              | 位数       | 取值范围                                                     | 默认值   | 描述                                                         |
| --------- | ----------------------------- | ---------- | ------------------------------------------------------------ | -------- | ------------------------------------------------------------ |
| `byte`    | 1                             | 8          | -128（$-2^7$） 到 127（$2^7 - 1$）                           | 0        | 是最小的整数类型，适合用于节省内存，例如在处理文件或网络流时存储小范围整数数据。 |
| `short`   | 2                             | 16         | -32768（$-2^{15}$） 到 32767（$2^{15} - 1$）                 | 0        | 较少使用，通常用于在需要节省内存且数值范围在该区间的场景。   |
| `int`     | 4                             | 32         | -2147483648（$-2^{31}$） 到 2147483647（$2^{31} - 1$）       | 0        | 最常用的整数类型，可满足大多数日常编程中整数计算的需求。     |
| `long`    | 8                             | 64         | -9223372036854775808（$-2^{63}$） 到 9223372036854775807（$2^{63} - 1$） | 0L       | 用于表示非常大的整数，当 `int` 类型无法满足需求时使用，定义时数值后需加 `L` 或 `l`。 |
| `float`   | 4                             | 32         | -3.4028235E38 到 3.4028235E38                                | 0.0f     | 单精度浮点数，用于表示小数，精度相对较低，定义时数值后需加 `F` 或 `f`。 |
| `double`  | 8                             | 64         | -1.7976931348623157E308 到 1.7976931348623157E308            | 0.0d     | 双精度浮点数，精度比 `float` 高，是 Java 中表示小数的默认类型。 |
| `char`    | 2                             | 16         | '\u0000'（0） 到 '\uffff'（65535）                           | '\u0000' | 用于表示单个字符，采用 Unicode 编码，可表示各种语言的字符。  |
| `boolean` | 无明确字节大小（理论上 1 位） | 无明确位数 | `true` 或 `false`                                            | `false`  | 用于逻辑判断，只有两个取值，常用于条件判断和循环控制等逻辑场景。 |

注意：`Float.MIN_VALUE` / `Double.MIN_VALUE` 表示的是**最小正非零值**（如 `1.4E-45`），并不是负的最小值；浮点类型的最小负值是 `-MAX_VALUE`。

注意：

- Java八种基本数据类型的字节数：1字节(byte、boolean)、 2字节(short、char)、4字节(int、float)、8字节(long、double)
- 浮点数的默认类型为double（如果需要声明一个常量为float型，则必须要在末尾加上f或F）
- 整数的默认类型为int（声明 Long 型在末尾加上l或者L）
- 八种基本数据类型的包装类：除了 char 的是 Character、int 类型的是 Integer，其他都是首字母大写
- char 类型是无符号的，不能为负，所以是0开始的

### 数据类型转换方式

#### 自动类型转换（隐式转换）

当目标类型的范围**大于**源类型时，Java 会自动将源类型转换为目标类型，不需要显式的类型转换。

例如，将`int`转换为`long`、将`float`转换为`double`等。

#### 强制类型转换（显式转换）

当目标类型的范围**小于**源类型时，需要使用强制类型转换将源类型转换为目标类型。这**可能导致数据丢失或溢出**。

例如，将`long`转换为`int`、将`double`转换为`int`等。

语法为：$目标类型\ 变量名 = (目标类型) 源类型$。

```java title="示例"
long longValue = 100L;
int intValue = (int) longValue; // 强制类型转换，可能会有数据丢失或溢出
```

#### 字符串转换

Java 提供了**将字符串表示的数据转换为其他类型数据**的方法。

例如：

- 将字符串转换为整型`int`，可以使用`Integer.parseInt()`方法；
- 将字符串转换为浮点型`double`，可以使用`Double.parseDouble()`方法等。

#### 数值之间的转换

Java 提供了一些数值类型之间的转换方法，如将整型转换为字符型、将字符型转换为整型等。

这些转换方式可以通过类型的包装类来实现，例如`Character`类、`Integer`类等提供了相应的转换方法。

### 类型转换的问题

#### 基本数据类型转换的问题

小范围数据类型赋值给大范围时，自动进行类型转换，此种转换通常是安全的。

但反过来，会发生**数据溢出或精度损失**的问题。

- **数据溢出**：

  当大范围数据类型赋值给小范围数据类型，即目标类型无法容纳原数据，就发生数据溢出；

  例如：`byte`类型取值范围`-128~127`，$$$300_{十进制}=00000001\ 00101100_{二进制}$$$，强转为 `byte`时，丢弃高位字节，保留低位即`00101100`也就是十进制的44。

- **精度损失**：

  在进行浮点数类型转换时，可能发生精度丢失。由于浮点数的表示方式不同，将一个单精度浮点数(`float`)转换为双精度浮点数(`double`)时，精度可能会损失，如果 double 转换为 int 也会发生精度损失的问题。

#### 对象引用转换的问题

向上转型是自动进行且安全的，如：

```java
class Animal {}
class Dog extends Animal {}

Dog dog = new Dog();
Animal animal = dog; // 自动向上转型
```

但向下转型需要手动进行，且存在风险。

如果父类对象实际上并不是目标子类的实例，在转型时就会抛出异常`ClassCastException`：

```java
Animal animal = new Animal();
Dog dog = (Dog) animal; // 运行时抛出ClassCastException
```

原因在于：Java 的对象在运行时会记录其真实类型，当进行向下转型时，Java 会检查对象的实际类型是否与目标类型兼容。如果不兼容，就会抛出`ClassCastException`。

解决方式：需要使用 `instanceof` 检查：

```java
if (animal instanceof Dog) {
    Dog dog = (Dog) animal; // 只有确认animal是Dog的实例时才进行转型
}
```

### BigDecimal与double

**金额这类要求十进制计算准确的场景，一般使用 BigDecimal，因为double不能精确表示很多十进制小数**。

double 使用二进制浮点数表示数值，无法用有限位数准确表示 0.1，0.2这些数，只能保存近似值，导致计算时可能出现误差。

BigDecimal 可以理解为用一个任意精度整数和一个scale来表示十进制数，比如1.23可以表示为123乘以10的-2次方。这样可以准确保存十进制数值，并按指定规则进行运算。

#### BidDecimal 注意事项

1. **创建对象时避免直接传double**：

   `new BigDecimal(0.1)`会把 double 已经存在的近似值转换成 BigDecimal，不能得到精确十进制 0.1，所以一般使用字符串构造；

   如果数据本来就是 double，可以使用 `BigDecimal.valueOf()`，它会通过 double 的字符串表示来构造。

   但`valueOf`不能修复之前浮点运算产生的误差，比如先算`0.1 + 0.2`再传进去，得到的仍然是`0.30000000000000004`。

   所以金额最好从输入和存储环节就使用明确的十进制表示。

2. **除法需要考虑舍入规则**：

   BigDecimal 并不代表所有计算都能得到有限位数的精确结果。比如1除以3，如果要求精确结果，又没有指定舍入规则，就会抛出`ArithmeticException`。保留几位小数、采用哪种舍入规则，需要根据业务约定。

   ```java
   BigDecimal result = BigDecimal.ONE.divide(
       new BigDecimal("3"), 2, RoundingMode.HALF_UP
   );
   System.out.println(result); // 0.33，保留两位小数，按HALF_UP舍入
   ```

3. **比较数值时区分equals和compareTo**：

   equals会同时比较数值和scale，而compareTo只比较数值大小：

   ```java
   BigDecimal x = new BigDecimal("1.0");
   BigDecimal y = new BigDecimal("1.00");
   
   System.out.println(x.equals(y));       // false，scale不同
   System.out.println(x.compareTo(y));   // 0，数值相等
   ```

   所以，如果只是判断金额数值是否相等，一般使用`compareTo(...) == 0`。

   另外，BigDecimal是不可变对象，add、subtract等方法返回的是计算结果，需要接住返回值。

### 装箱与拆箱

装箱（Boxing）和拆箱（Unboxing）是将**基本数据类型和对应的包装类之间进行转换**的过程。

```java
Integer i = 10;  //装箱
int n = i;   //拆箱
```

#### 自动装箱

自动装箱主要发生在两种情况，一种是**赋值时**，另一种是在**方法调用时**。

1. 赋值时：最常见的一种情况，在Java 1.5以前我们需要手动地进行转换，而现在所有的转换都是由编译器来完成。

   ```java
   //before autoboxing
   Integer iObject = Integer.valueOf(3);
   int iPrimitive = iObject.intValue();
   
   //after java5
   Integer iObject = 3; //autoboxing - primitive to wrapper conversion
   int iPrimitive = iObject; //unboxing - object to primitive conversion
   ```

2. 方法调用时：在方法调用时，可以传入原始数据值或者对象，同样编译器会帮我们进行转换。

   ```java
   public static Integer show(Integer iParam){
      System.out.println("autoboxing example - method invocation i: " + iParam);
      return iParam;
   }
   
   //autoboxing and unboxing in method invocation
   show(3); //autoboxing
   int result = show(3); //unboxing because return type of method is Integer
   ```

   show方法接受Integer对象作为参数，当调用`show(3)`时，会将int值转换成对应的Integer对象，这就是自动装箱；show方法返回Integer对象，而`int result = show(3);`中result为int类型，所以这时候发生自动拆箱操作，将show方法的返回的Integer对象转换成int值。

**弊端**：在一个循环中进行自动装箱操作的情况，如下面的例子就会创建多余的对象，影响程序的性能。

```java
Integer sum = 0; 
for(int i=1000; i<5000; i++) { sum+=i; } 
```

`sum = sum + i`，`+`这个操作符不适用于Integer对象，首先sum进行自动拆箱操作，进行数值相加操作，最后发生自动装箱操作转换成Integer对象。其内部变化如下：

```java
int result = sum.intValue() + i; 
Integer sum = Integer.valueOf(result); 
```

由于这里声明的 sum 为 Integer 类型，自动装箱实际上由编译器替换为 `Integer.valueOf(...)` 调用，命中 `IntegerCache`（默认 -128~127）时会复用缓存对象，但本例中循环值都已超出缓存范围，因此会创建将近 4000 个 Integer 对象，降低程序性能并加重 GC 负担。

因此，在编程时需要注意：正确声明变量类型，避免因为自动装箱引起性能问题

> 另外，`new Integer(int)` 自 JDK 9 起已被 `@Deprecated`，应统一使用 `Integer.valueOf(int)` 或直接自动装箱

### Integer与int

#### Integer的作用

Integer是int类型的包装类，就是把一个int值包装成对象。**最主要的作用，是让整数也能用在需要对象的地方。**

1. **泛型和集合中的应用**

   Java中的**泛型类型参数不能直接使用基本数据类型**，所以，当把整数放进ArrayList、HashMap这些集合里时，就需要用到Integer。

2. **表示没有值的情况**

   Integer可以用`null`表示“没有值”，而int不能；但要注意：**Integer为null时不能自动拆箱，否则会抛出`NullPointerException`**。

3. **提供处理整数的方法**

   比如字符串转整数、整数转字符串、进制转换等，且都是静态方法，**调用它们不需要先创建Integer对象**。

   ```java
   int num = Integer.parseInt("123");       // 字符串转int
   String str = Integer.toString(123);      // int转字符串
   String hex = Integer.toHexString(255);   // 转十六进制，结果为"ff"
   ```

#### Integer vs. int

| 对比维度    | int（基本类型）              | Integer（包装类，引用类型）                                  |
| ----------- | ---------------------------- | ------------------------------------------------------------ |
| 类型归属    | 基本数据类型                 | 引用类型，是 `int` 的包装类                                  |
| 实例化      | 无需 new，直接定义使用       | 本质是对象，需要实例化；Java5 + 支持自动装箱，不用手动 new   |
| 默认值      | 0                            | null                                                         |
| 内存 & 性能 | 直接存数值，开销小，运算更快 | 对象存储，有对象头额外内存开销，速度弱于 int                 |
| 装箱拆箱    | -                            | 支持**自动装箱（int → Integer）、自动拆箱（Integer → int）** |
| 空指针风险  | -                            | 值为 `null` 时进行自动拆箱，直接抛出 `NullPointerException`  |
| 适用场景    | 普通数值运算、局部变量       | 泛型、集合（List/Map 不能放基本类型）、需要支持空值标识、作为对象传参 |

#### int类型保留的原因

包装类是引用类型，对象的引用和对象本身分开存储；对于基本类型数据，变量对应的内存块直接存储数据本身。

因此，基本类型数据在读写效率方面，比包装类高效。

此外，在64位JVM上，在开启引用压缩的情况下，一个Integer对象占用16个字节的内存空间，而一个int类型数据只占用4字节的内存空间，前者对空间的占用是后者的4倍。

总而言之，**不管是读写效率，还是存储效率，基本类型都比包装类高效**。

#### Integer缓存

Integer内部有一个**`IntegerCache`**，用来缓存一部分常用整数对应的Integer对象。

**通过Integer.valueOf创建这些数值的对象时，会直接复用缓存，而不是每次都创建新对象。**

Integer.valueOf至少会缓存-128到127。HotSpot默认的缓存范围也是-128到127，缓存上限可以通过JVM参数调整。

自动装箱会调用Integer.valueOf，所以也会用到缓存：

```java
Integer a = 127;
Integer b = 127;
System.out.println(a == b); // true，复用了同一个缓存对象

Integer c = 128;
Integer d = 128;
System.out.println(c == d); // 默认缓存范围下为false
System.out.println(c.equals(d)); // true，比较的是整数值
```

如果显式使用`new Integer(...)`，则会创建新对象，不会复用IntegerCache。这个构造方法从Java 9开始已被标记为过时，**正常创建Integer应当使用`Integer.valueOf()`或者自动装箱**。

一个易混淆情况的说明，Integer与int的比较：

```java
Integer num = 128;
System.out.println(num == 128); // true，num先拆箱，再比较int值
```

但若 num 为 null，则该比较在自动拆箱时会抛出 `NullPointerException`。实际开发中，**比较两个Integer的数值一般使用`equals`**，需要兼容 null  时则可使用 `Objects.equals`。

Integer缓存的主要目的是<u>减少常用小整数的重复对象分配，节省内存</u>。

## 面向对象

> OOP定义及其三大特性，Java中的多态体现与作用，面向对象编程六大设计原则，重写与重载，抽象类与普通类，抽象类与接口，静态变量与静态方法，非静态内部类与静态内部类……

### 如何理解OOP？

面向对象是一种编程范式，它**将现实世界中的事物抽象为对象**，对象具有属性（称为字段或属性）和行为（称为方法）。面向对象编程的设计思想是以对象为中心，通过对象之间的交互来完成程序的功能，具有灵活性和可扩展性，通过封装和继承可以更好地应对需求变化。

Java面向对象的三大特性包括：**封装、继承、多态**：

- **封装**：指将对象的属性（数据）和行为（方法）结合在一起，对外隐藏对象的内部细节，仅通过对象提供的接口与外界交互。封装的目的是增强安全性和简化编程，使得对象更加独立。
- **继承**：是一种可以使得子类自动共享父类数据结构和方法的机制。它是代码复用的重要手段，通过继承可以建立类与类之间的层次关系，使得结构更加清晰。
- **多态**：指允许不同类的对象对同一消息作出响应。即同一个接口，使用不同的实例而执行不同操作。多态性可以分为编译时多态（重载）和运行时多态（重写）。它使得程序具有良好的灵活性和扩展性。

### 多态体现在哪些方面？

- **方法重载：**
  - 指**同一类中可以有多个同名方法**，它们**具有不同的参数列表**（参数类型、数量或顺序不同）。虽然方法名相同，但根据传入的参数不同，编译器会在编译时确定调用哪个方法。
  - 示例：对于一个 `add` 方法，可以定义为 `add(int a, int b)` 和 `add(double a, double b)`。
- **方法重写：**
  - 指**子类能够提供对父类中同名方法的具体实现**。在运行时，JVM会根据对象的实际类型确定调用哪个版本的方法。这是实现多态的主要方式。
  - 示例：在一个动物类中，定义一个 `sound` 方法，子类 `Dog` 可以重写该方法以实现 `bark`，而 `Cat` 可以实现 `meow`。
- **接口与实现：**
  - 多态也体现在接口的使用上，多个类可以实现同一个接口，并且用接口类型的引用来调用这些类的方法。这使得程序在面对不同具体实现时保持一贯的调用方式。
  - 示例：多个类（如 `Dog`, `Cat`）都实现了一个 `Animal` 接口，当用 `Animal` 类型的引用来调用 `makeSound` 方法时，会触发对应的实现。
- **向上转型和向下转型：**
  - 在Java中，可以使用父类类型的引用指向子类对象，这是向上转型。通过这种方式，可以在运行时期采用不同的子类实现。
  - 向下转型是将父类引用转回其子类类型，但在执行前需要确认引用实际指向的对象类型以避免 `ClassCastException`。

### 多态解决了什么问题？（多态的作用）

多态可以**提高代码的扩展性和复用性**，是很多设计模式、设计原则、编程技巧的代码实现基础。比如策略模式、基于接口而非实现编程、依赖倒置原则、里式替换原则、利用多态去掉冗长的 if-else 语句等等。

### 面向对象的设计原则有哪些？

面向对象编程中的六大原则：

- **单一职责原则（SRP）**：一个类应该只有一个引起它变化的原因，也就是**一个类只承担一项职责**。 
  例子：员工类只负责维护员工基础信息，不兼任薪资计算、考勤统计这类无关职责，职责变更互不干扰。
- **开放封闭原则（OCP）**：软件实体（类、方法、模块等）应当**对扩展开放，对修改关闭**。 
  例子：定义图形抽象接口，新增圆形、三角形时新增实现类，不需要改动原有图形接口和已有业务代码。
- **里氏替换原则（LSP）**：**子类对象应当可以替换所有父类对象**，替换后原有程序行为符合预期。 
  例子：现实中正方形属于矩形，但矩形支持宽、高独立修改；若正方形继承矩形，修改宽时高同步变化，原有操作矩形的代码运行结果异常，这就是违反该原则。
- **接口隔离原则（ISP）**：客户端不应当依赖它不需要的接口，**接口要小而专一**，避免臃肿大接口。 
  例子：不要把飞行、游泳、进食全部放在同一个动物接口，拆分出多个细粒度接口，类只实现自身具备能力的接口，不用空实现无关方法。
- **依赖倒置原则（DIP）**：**高层模块不依赖低层模块，二者都依赖抽象；抽象不依赖细节，细节依赖抽象**。 
  例子：业务服务层不直接 new MySQL 实现类，而是依赖数据访问抽象接口，通过注入不同实现切换数据库，无需修改上层业务代码。
- **最少知识原则（迪米特法则，LoD）**：**一个对象应当对其他对象保持最少了解，只和自己的直接朋友通信**。 
  例子：A 类需要 C 的数据，不要让 A 越过 B 直接访问 B 内部的 C 对象，由 B 提供方法封装查询，降低对象之间的耦合。

### 重载与重写

**重载是同名方法的参数列表不同；重写是子类重新实现父类的方法。**它们最大的区别，是方法选择发生的时机不同。

#### Overloading

```java
class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public double add(double a, double b) {
        return a + b;
    }
}
// `add(1, 2)`匹配int参数的方法，
// `add(1.0, 2.0)`匹配double参数的方法
```

重载**可发生在同一个类中，也可涉及继承得到的方法**。方法名相同，但参数列表（参数类型、数量与顺序）不同，**编译器**会根据调用时的参数与声明类型选择对应方法。

> 注意：**不能只靠返回类型不同来重载方法**。如果方法名和参数列表相同，只修改返回类型，编译器会认为方法重复。

#### Overriding

重写**发生在继承关系中**。子类对父类可被重写的实例方法提供新的实现，方法名和参数列表保持一致。调用时，**JVM** 会根据对象的实际类型执行对应的实现。

```java
class Parent {
    public Number getValue() {
        return 1;
    }
}

class Child extends Parent {
    @Override
    public Integer getValue() {
        return 2;
    }
}
```

```java
Parent obj = new Child();
System.out.println(obj.getValue()); // 输出2，执行的是Child的方法
```

这里子类返回Integer，父类返回Number，也是合法的重写，因为Integer是Number的子类，这叫**协变返回类型**。

更精确的说，协变返回类型（Covariant Return Type），指**子类重写父类方法时，允许子类方法的返回类型是父类方法返回类型的子类型。**该特性从从 Java 5开始支持。

**重写的限制**：

- 返回类型如果是基本类型或者void，要与父类一致；如果是引用类型，可以与父类相同，也可以是父类返回类型的子类型。

- 访问权限不能比父类更严格，比如父类是public，子类不能改成protected。

- 不能新增父类方法没有声明的受检异常，也不能把受检异常的范围扩大，但可以不抛或者抛更具体的受检异常。

- final方法不能重写，private方法不被子类继承；static方法属于类，子类的同名同参数静态方法属于隐藏，不是重写。

  ```java title="static例子" collapse={2-21}
  class Animal {
      public static void sound() {
          System.out.println("Animal");
      }
  }
  
  class Dog extends Animal {
      public static void sound() {
          System.out.println("Dog");
      }
  }
  
  // 类名直接调用
  Animal.sound(); // Animal
  Dog.sound();    // Dog
  
  // 用引用调用静态方法（不推荐，但语法允许）
  Animal a = new Dog();
  a.sound(); // 输出 Animal！不是 Dog
  // 这里 a 的引用类型是 Animal，虽然实际对象是 Dog，但静态方法是隐藏（hide），不是重写，不会触发多态。
  // 编译器直接根据引用类型绑定静态方法，和 `new` 出来的对象是谁无关。
  ```

`@Override`不是重写成立的必要条件，但建议加上，让编译器帮我们检查方法是否真的重写成功，避免把参数写错后变成了重载。

总的来说，重载主要是**在编译时**确定调用哪个签名的方法，而重写是**在运行时**确定这个方法执行哪个类的实现。

### 抽象类与普通类

抽象类使用 `abstract` 修饰，它和普通类核心差异整理如下：

| 对比维度 | 普通类                                          | 抽象类（abstract class）                                     |
| -------- | ----------------------------------------------- | ------------------------------------------------------------ |
| 实例化   | 可以直接 new 实例化对象                         | **不能直接实例化**，仅能被子类继承                           |
| 方法形态 | 所有方法都必须有具体实现                        | 既可以有带实现的普通方法，也可以包含**没有方法体的抽象方法** |
| 继承规则 | 单继承（extends），可实现多个接口（implements） | 同样单继承（extends），可实现多个接口（implements），继承规则和普通类一致 |
| 定位用途 | 独立完整实体，可直接拿来创建对象使用            | 作为模板基类，用来定义子类通用规范，交由子类去扩展实现抽象方法 |

> 注意：如果抽象类里面**没有写任何抽象方法**，依然是抽象类，照样不能实例化；只要类里面存在抽象方法，这个类就必须声明为 abstract。

### 抽象类与接口

#### 两者的特点：

- 抽象类用于**描述类的共同特性和行为**，可以有成员变量、构造方法和具体方法。适用于**有明显继承关系**的场景。
- 接口用于**定义行为规范**，可以多实现，只能有常量和抽象方法（Java 8 以后可以有默认方法和静态方法）。适用于**定义类的能力或功能**。

#### 两者的区别：

| 对比维度          | 抽象类（abstract class）                                     | 接口（interface）                                            |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 继承 / 实现关键字 | 使用 `extends` 继承                                          | 使用 `implements` 实现                                       |
| 多实现限制        | 一个类只能继承**一个**抽象类（单继承）                       | 一个类可以**同时实现多个接口**，间接实现多重继承             |
| 方法形态          | 可以有抽象方法（无实现），也可以有普通实例方法、静态方法，都支持写方法体 | Java 8 前：只有 public abstract **抽象方法**；Java8+：支持 **default、static** 带体方法；Java9+：支持 **private** 私有辅助方法 |
| 访问权限          | 成员默认是包访问权限（default）；抽象方法不能被 private、static、synchronized、native 等修饰 | 抽象方法默认 `public abstract`；default/static 方法默认 public；Java9 可定义 private 方法 |
| 成员变量          | 可以定义实例变量、静态变量，变量可以修改                     | 只能是常量，默认 `public static final`，必须初始化、不可修改 |

### 抽象类能被 final 修饰吗？

**不能**。Java中抽象类用来被继承，而 final 修饰符用于禁止类被继承或方法被重写，所以abstract与final互斥，不可同时使用。

### 静态变量与静态方法

在 Java 中，**静态变量和静态方法是与类本身关联**，而不是与类的实例（对象）关联。它们**在内存中只存在一份**，可以被类的所有实例共享。

#### 静态变量

静态变量（也称为类变量）是在类中使用`static`关键字声明的变量。它们属于类而不是任何具体的对象。主要的特点：

- **共享性**：所有该类的实例共享同一个静态变量。如果一个实例修改了静态变量的值，其他实例也会看到这个更改。
- **初始化**：静态变量在类被加载时初始化，只会对其进行一次分配内存。
- **访问方式**：静态变量可以直接通过类名访问，也可以通过实例访问，但推荐使用类名。

#### 静态方法

静态方法是在类中使用`static`关键字声明的方法。类似于静态变量，静态方法也属于类，而不是任何具体的对象。主要的特点：

- **无实例依赖**：静态方法可以在没有创建类实例的情况下调用。对于静态方法来说，不能直接访问非静态的成员变量或方法，因为静态方法没有上下文的实例。
- **访问静态成员**：静态方法可以直接调用其他静态变量和静态方法，但不能直接访问非静态成员。
- **多态性**：静态方法不支持重写（Override），但可以被隐藏（Hide）。

#### 使用场景

- **静态变量**：常用于**需要在所有对象间共享的数据**，如计数器、常量等。
- **静态方法**：常用于助手方法（utility methods）、获取类级别的信息或者是没有依赖于实例的数据处理。

### 非静态内部类和静态内部类

| 对比项         | 非静态内部类（成员内部类）                                   | 静态内部类（静态嵌套类）                                     |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 依赖关系       | 依赖外部类实例                                               | 不依赖外部类实例                                             |
| 实例化方式     | 必须先创建外部类实例，再创建内部类对象：`Outer outer = new Outer();``Outer.Inner inner = outer.new Inner();` | 可直接独立实例化：`Outer.StaticInner inner = new Outer.StaticInner();` |
| 访问外部类成员 | 可直接访问外部类静态、实例成员（含私有）                     | 只能直接访问外部类静态成员；访问外部类实例成员，必须拿到外部类实例引用 |
| 定义静态成员   | Java 16 之前，不能定义静态成员；Java16 + 放宽                | 可以正常定义静态变量、静态方法                               |
| 隐含引用       | 持有外部类的隐式引用`Outer.this`                             | 没有外部类的隐式引用                                         |
| 使用场景       | 需要和外部实例强绑定、回调、封装实例关联逻辑                 | 工具类、辅助数据类（如 Builder、DTO），不绑定外部实例        |

> 豆包解释：[Java非静态与静态内部类详解](https://www.doubao.com/thread/xdhhHi4KXxHmBvA8p) 

#### 非静态内部类可以直接访问外部方法，编译器是怎么做到的？

```java
public class Outer {
    private void outerMethod() {
        System.out.println("外部类实例方法");
    }

    // 非静态成员内部类
    class Inner {
        public void innerFunc() {
            // 表面：直接调用外部方法
            outerMethod();
            // 编译器实际改写为：Outer.this.outerMethod();
        }
    }

    public static void main(String[] args) {
        Outer outer = new Outer();
        Outer.Inner inner = outer.new Inner();
        inner.innerFunc();
    }
}
```

非静态内部类可以直接访问外部类的实例方法、实例变量，底层核心原理：**编译器会为非静态内部类隐式维护一个指向外部类实例的引用**。

在编译阶段，编译器会做两件关键事情：

1. 给非静态内部类自动添加一个成员变量，用来保存外部类实例的引用（也就是我们代码里隐式的 `Outer.this`，字节码里名字是 `this$0`）；
2. 改写非静态内部类的构造方法，**默认把外部类实例作为参数传入构造器**，在内部类对象创建的时候，把外部实例引用赋值给这个隐式成员。

当你在内部类中直接调用外部类的实例方法时，编译器会把这条调用语句改写，通过这个提前存好的外部实例引用去发起方法调用。这就是我们看起来 “不用拿到外部对象，就能直接访问外部实例成员” 的本质。

> 补充区分：静态内部类不会生成这个隐式外部引用，因此无法直接访问外部类的实例成员，必须手动传入外部类对象引用。

>  ⚠这个隐式引用 `this$0` 是强引用。如果内部类对象长期存活，外部类实例就无法被 GC 回收，很容易出现内存泄漏。

进一步看看，编译后会生成两个 class 文件：`Outer.class`、`Outer$Inner.class`。而反编译 `Outer$Inner.class`：

```java
// 反编译结果
class Outer$Inner {
  // 编译器自动合成的字段：保存外部类实例的强引用 this$0
  final Outer this$0;

  // 编译器改写后的构造方法，自动接收外部类实例 Outer
  Outer$Inner(Outer this$0) {
    this.this$0 = this$0;
  }

  public void innerFunc() {
    // 这里不是凭空调用，是通过 this$0 调用外部方法
    this.this$0.outerMethod();
  }
}
```

## 关键字

> final，static

### final

final主要用来修饰类、方法和变量，分别表示**不能继承、不能重写、不能再次赋值**。

#### 修饰类

final修饰的类不能被继承，比如String就是final类。这样可以避免子类重写方法，改变这个类原本的行为。

不过，**类被final修饰，不代表它的对象就一定不可变**。如果类里还有可以修改字段的方法，对象的内容仍然可以改变。

#### 修饰方法

final修饰的方法不能被子类重写，但可以正常被继承和调用，也可以定义不同参数列表的同名方法，也就是重载。

比如Object的getClass方法就是final方法，子类不能通过重写改变它返回对象实际类型的行为。

#### 修饰变量

final变量只能被赋值一次。局部变量必须在使用前完成赋值；final实例字段可以在声明、实例初始化块或者构造方法中赋值，但必须保证构造完成时已经赋值，而且不能重复赋值。

对于基本类型，不能再改变变量保存的值；对于引用类型，不能再让变量指向另一个对象，但对象内部的数据可能仍然可以修改：

```java
final int num = 10;
// num = 20; // 编译不通过

final StringBuilder builder = new StringBuilder("Hello");
builder.append(" World"); // 可以，修改的是对象内部的内容
// builder = new StringBuilder(); // 编译不通过，不能重新赋值
```

另外，final变量不一定都是编译期常量。只有基本类型或者String类型的final变量，并且使用常量表达式初始化，才是Java所说的常量变量。比如`final int num = 10`是，但`final int num = getNum()`不是。

#### 为什么String是不可变的？

String不可变不是只靠类上的final。它还把内部存储封装起来，不提供修改自身内容的公开方法，构造和对外传递数据时也会避免把可修改的内部存储直接暴露出去。final类主要是防止子类通过继承改变这些行为。

所以，设计不可变对象时，需要同时考虑字段、可变成员的防御性拷贝和对外接口，不能只给类或者引用加一个final就认为完成了。

### static

`static` 关键字主要用于修饰类的成员（变量、方法、代码块）和内部类，其核心作用是**将成员与类本身关联，而非与类的实例（对象）关联**。

#### 1、修饰变量

被 `static` 修饰的变量属于类本身，而非类的某个实例。所有对象共享同一份静态变量，内存中只存在一份副本。可以通过 `类名.变量名` 直接访问，无需创建对象（也可通过对象访问，但不推荐）。

通常用于存储所有对象共享的数据，如常量、计数器等。

#### 2、修饰方法

静态方法属于类，不属于任何实例，因此静态方法**不能直接访问类中的非静态成员（变量 / 方法）**（因为非静态成员依赖于对象存在），但可以访问静态成员。通过 `类名.方法名` 直接调用，无需创建对象。

通常用于工具类方法（如 `Math.random()`）、工厂方法等，不需要依赖对象状态即可完成操作。

#### 3、修饰代码块

静态代码块在**类初始化阶段**（即执行 `<clinit>` 时）执行，且只执行一次（优于对象构造方法），用于初始化静态变量或执行类级别的预处理操作。

JVM 的类生命周期为：加载 → 链接（验证、准备、解析）→ 初始化，静态代码块属于"初始化"阶段而非"加载"阶段。

多个静态代码块按定义顺序执行，且先于非静态代码块和构造方法。

#### 4、修饰内部类

静态内部类不依赖于外部类的实例，可以独立存在，**不能直接访问外部类的非静态成员**（需通过外部类实例访问）。

当内部类与外部类的实例无关时使用，避免内部类持有外部类的引用导致的内存泄漏。

## 拷贝问题（深/浅）

> 深拷贝与浅拷贝的区别，实现深拷贝的三种方法

### 区别

![示例](https://cdn.xiaolincoding.com//picgo/1720683675376-c5af6668-4538-479f-84e8-42d4143ab101.webp)

- **浅拷贝**指：<u>只复制对象本身和其内部的值类型字段，但不会复制对象内部的引用类型字段</u>。换句话说，浅拷贝只是创建一个新的对象，然后将原对象的字段值复制到新对象中，但如果原对象内部有引用类型的字段，只是将引用复制到新对象中，两个对象指向的是同一个引用对象。
- **深拷贝**指：<u>在复制对象的同时，将对象内部的所有引用类型字段的内容也复制一份，而不是共享引用</u>。换句话说，深拷贝会递归复制对象内部所有引用类型的字段，生成一个全新的对象以及其内部的所有对象。

### 实现深拷贝的三种方法

#### 实现 Cloneable 接口并重写 clone() 方法

这种方法要求对象及其所有引用类型字段**都实现 Cloneable 接口**，并且重写 clone() 方法。在 clone() 方法中，通过递归克隆引用类型字段来实现深拷贝。

```java
class MyClass implements Cloneable {
    private String field1;
    private NestedClass nestedObject;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        MyClass cloned = (MyClass) super.clone();
        cloned.nestedObject = (NestedClass) nestedObject.clone(); // 深拷贝内部的引用对象
        return cloned;
    }
}

class NestedClass implements Cloneable {
    private int nestedField;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

#### 使用序列化和反序列化

通过将对象序列化为字节流，再从字节流反序列化为对象来实现深拷贝。要求对象及其所有引用类型字段**都实现 Serializable 接口**。

```java
import java.io.*;

class MyClass implements Serializable {
    private String field1;
    private NestedClass nestedObject;

    public MyClass deepCopy() {
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(bos);
            oos.writeObject(this);
            oos.flush();
            oos.close();

            ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
            ObjectInputStream ois = new ObjectInputStream(bis);
            return (MyClass) ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }
}

class NestedClass implements Serializable {
    private int nestedField;
}
```

#### 手动递归复制

针对特定对象结构，手动递归复制对象及其引用类型字段。适用于对象结构复杂度不高的情况。

```java
class MyClass {
    private String field1;
    private NestedClass nestedObject;

    public MyClass deepCopy() {
        MyClass copy = new MyClass();
        copy.setField1(this.field1);
        copy.setNestedObject(this.nestedObject.deepCopy());
        return copy;
    }
}

class NestedClass {
    private int nestedField;

    public NestedClass deepCopy() {
        NestedClass copy = new NestedClass();
        copy.setNestedField(this.nestedField);
        return copy;
    }
}
```

## 泛型

### 什么是泛型？

泛型就是在定义类、接口或者方法时，先用一个类型参数来表示具体的数据类型，等使用时再指定。比如`List<String>`，就是告诉编译器，这个集合里存放的是String。

### 为什么需要泛型？

**泛型主要解决两个问题：一是复用代码，二是把类型检查提前到编译阶段。**

### 泛型在运行时还在吗？

Java泛型主要通过**类型擦除**来实现。编译时会进行类型检查，生成字节码时，会把类型参数替换成它的上界，没有指定上界时就替换成Object，并在必要的位置插入类型转换。

![泛型-编译期检查，运行时擦除](https://cdn.xiaolincoding.com/xiaolinnote/interview/images/java/f6e84160_generic-type-erasure.png)

类型擦除不代表所有泛型信息都消失了。类、字段和方法声明中的部分泛型信息会保存在class文件的Signature属性中，可以通过反射读取。但不能仅凭一个普通的`new ArrayList<String>()`对象，就直接获知它的类型参数是String。

还有两个常见的注意点：

- **泛型类型参数只能使用引用类型**，不能写`List<int>`，要写`List<Integer>`。
- Integer虽然是Number的子类，但`List<Integer>`不是`List<Number>`的子类。**如果方法要接收不同数值类型的列表，可以根据读写需求使用通配符**，比如`List<? extends Number>`用于读取Number，`List<? super Integer>`允许写入Integer。

![泛型通配符：读和写的边界](https://cdn.xiaolincoding.com/xiaolinnote/interview/images/java/0a04ba71_generic-wildcards.png)

## 对象

> 创建对象的方式，new出来的对象的回收时机，获取四有对象的方式

### Java创建对象的方式

| 方式             | 核心原理       | 是否调用构造器？       | 特点与应用场景                              |
| :--------------- | :------------- | :--------------------- | :------------------------------------------ |
| **`new` 关键字** | JVM 指令       | **是**                 | 最标准、最常用，紧密耦合                    |
| **反射**         | 运行时类信息   | **是** (`Constructor`) | 灵活，解耦，用于框架                        |
| **`clone()`**    | 复制现有对象   | **否**                 | 基于原型创建副本，需实现 `Cloneable`        |
| **反序列化**     | 从字节流恢复   | **否**                 | 用于持久化和网络通信，需实现 `Serializable` |
| **工厂模式**     | 方法封装 `new` | **是** (在方法内)      | 解耦，隐藏创建逻辑，控制实例                |

#### 1、使用new关键字

这是最常见、最基础的创建对象方式。通过调用类的构造器来实例化对象。

```java
// 定义一个类
public class Person {
    private String name;
    
    public Person() {} // 默认构造器
    public Person(String name) { // 带参构造器
        this.name = name;
    }
    
    public void sayHello() {
        System.out.println("Hello, " + name);
    }
}

// 使用 new 创建对象
public class Main {
    public static void main(String[] args) {
        Person person1 = new Person(); // 调用无参构造
        Person person2 = new Person("Alice"); // 调用有参构造
        
        person2.sayHello(); // 输出: Hello, Alice
    }
}
```

优点是简单、直接、明确。缺点是紧密耦合，必须知道具体的类名。

#### 2、使用Class类的newInstance()方法

通过 Java 的反射 API，在运行时动态地创建对象。这种方式不需要在编译时知道具体的类。

```java
MyClass obj = (MyClass) Class.forName("com.example.MyClass").getDeclaredConstructor().newInstance();
```

应用场景：框架设计（如 Spring 的 IOC 容器）、动态代理等。

**注意**：`Class.newInstance()` 在 JDK 9 后被标记为过时，因为它只能调用无参公有构造器，且会抛出所有受检异常。推荐使用 `Constructor.newInstance()`，更强大也更灵活。

##### 使用Constructor类的newInstance()方法

同样是通过反射机制，可以使用Constructor类的newInstance()方法创建对象。

```java
Constructor<MyClass> constructor = MyClass.class.getConstructor();
MyClass obj = constructor.newInstance();
```

#### 3、使用clone()方法

通过实现 `Cloneable` 接口并重写 `Object` 类的 `clone()` 方法，可以基于一个现有对象（原型）创建一个新的副本对象。

```java
// 实现 Cloneable 接口
public class Person implements Cloneable {
    private String name;
    
    // ... 构造器和其他方法 ...
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone(); // 浅拷贝
    }
}

public class Main {
    public static void main(String[] args) {
        Person original = new Person("Charlie");
        try {
            Person copy = (Person) original.clone(); // 创建副本
            copy.sayHello(); // 输出: Hello, Charlie
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }
}
```

`Object.clone()` 默认是浅拷贝，对于引用类型的字段，复制的是引用地址，而不是引用的对象本身。如果需要深拷贝，必须在 `clone()` 方法中手动对引用对象进行克隆。

#### 4、使用反序列化

通过 `ObjectInputStream` 从一个字节流（通常是文件或网络）中重建一个对象。

```java
import java.io.*;

// 必须实现 Serializable 接口
public class Person implements Serializable {
    private String name;
    // ... 构造器和其他方法 ...
}

public class Main {
    public static void main(String[] args) {
        Person personToSave = new Person("David");
        
        // 序列化对象到文件
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("person.dat"))) {
            oos.writeObject(personToSave);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        // 从文件反序列化对象
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("person.dat"))) {
            Person restoredPerson = (Person) ois.readObject(); // 创建新对象
            restoredPerson.sayHello(); // 输出: Hello, David
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

特点是不会调用类的任何构造器，类必须实现 `java.io.Serializable` 接口。

#### 5、使用工厂模式

这是一种设计模式，不直接使用 `new`，而是通过一个方法来返回对象实例。`getInstance()`、`valueOf()` 等都是常见的工厂方法。

```java
public class Person {
    private String name;
    
    private Person(String name) { // 构造器可以是私有的
        this.name = name;
    }
    
    // 静态工厂方法
    public static Person createPerson(String name) {
        // 这里可以做一些额外的逻辑，比如缓存、日志、返回子类实例等
        return new Person(name);
    }
}

public class Main {
    public static void main(String[] args) {
        // 不是用 new，而是用工厂方法创建
        Person person = Person.createPerson("Eva");
        person.sayHello();
    }
}
```

优点是将对象的创建与使用分离，降低耦合，还可以隐藏创建对象的复杂逻辑（如池化技术、缓存）。

Java 标准库中的例子：`Integer.valueOf(int)`，`Calendar.getInstance()`。

### new创建的对象何时回收？

通过new创建的对象，一般由垃圾回收器负责回收。**判断它能不能被回收，主要看它是否还可达；至于什么时候实际回收，由GC的执行时机决定。**

#### 如何判断对象还在不在使用？

HotSpot主要通过可达性分析判断对象是否存活。从GC Roots出发，沿着引用关系寻找对象，如果某个对象已经不能通过强引用链到达，就通常可以作为垃圾回收的候选对象。软引用、弱引用等特殊引用还会按各自规则处理。

常见的GC Roots包括活动线程栈中的引用、已加载类的静态字段引用，以及JNI全局引用等。

所以，**把一个变量设为null，只是断开这一条引用，不代表对象马上就会被回收**。如果它还被静态变量、集合或者其他对象引用，就可能一直存活。

#### 两个对象互相引用，会不会无法回收？

不会仅仅因为循环引用就无法回收。比如A引用B，B也引用A，但从GC Roots出发已经无法到达它们，那么这两个对象仍然可以被回收。这也是可达性分析和简单引用计数的区别。

#### 对象不可达后，什么时候实际回收？

不一定马上回收，要看什么时候触发GC，以及这次GC是否处理对象所在的区域。内存分配压力、堆使用情况、垃圾回收器的策略等，都会影响回收时机。

调用`System.gc()`也只是请求JVM尝试进行垃圾回收，不保证某个对象会立刻被回收，因此不能依赖它控制资源释放。

此外，垃圾回收主要负责对象占用的内存；

文件、数据库连接、Socket这些资源应该通过close或者try-with-resources及时释放。
不要依赖finalize，它的执行时机没有保证，也不能保证一定执行；这个机制已经过时，Java 18起被标记为待移除。

### 如何获取私有对象？

在 Java 中，私有对象通常指的是类中被声明为 `private` 的成员变量或方法。

可以通过下面两种方式来间接获取私有对象：

1. 使用公共访问器方法（getter 方法）
2. 反射机制

## 反射

> 反射的定义、原理以及应用场景

### 反射是什么？

反射：**在程序运行时获取类的结构信息，并动态创建对象、调用方法或者访问字段的机制**。

> 比如编译时没有写死要调用哪个类，而是在运行时读取配置，再根据类名找到这个类，就可以用到反射。

Java反射主要围绕Class对象展开，通过它可以获取构造方法、方法、字段等信息：

- **Constructor**：用于调用构造方法，创建对象。
- **Method**：用于获取方法信息，并通过invoke调用方法。
- **Field**：用于读取或者修改字段值。

#### 反射能随意访问私有成员吗？

不能说完全没有限制。`getMethod`主要获取public方法，包括继承的方法；`getDeclaredMethod`可以获取当前类声明的方法，包括private方法，但不包含继承来的方法。**能获取方法信息，不代表就有权限调用它。**

访问私有成员时，通常需要通过`setAccessible(true)`尝试关闭语言层面的访问检查，但仍然受到权限和模块封装的限制。Java 9引入模块系统后，如果目标包没有向调用方开放，可能无法启用访问。final字段的修改也有额外限制，不能认为反射能任意修改所有字段。

#### 反射有什么代价？

反射把部分检查推迟到了运行时，类名、方法名写错，或者参数不匹配，都可能到运行时才报错。它也增加了访问检查、动态调用等成本，具体性能取决于JDK版本和使用方式，不能简单说一定慢多少倍。

所以，反射适合框架、通用工具这些需要动态处理类型的场景，普通业务代码如果能直接调用，一般优先直接调用。频繁使用时，可以缓存Class、Method等信息，减少重复查找。

### 反射的应用场景

#### 1. 动态加载数据库驱动

反射的价值在于：程序可以在运行时根据类名字符串加载类，而不必在编译期写死。

例如，项目底层可能使用 MySQL，也可能使用 Oracle。假设有两个连接类 `com.chaos.java.mysqlConnection` 和 `com.chaos.java.oracleConnection`，就可以根据实际配置选择加载哪一个。

使用 JDBC 连接数据库时，常用 `Class.forName()` 通过反射加载驱动：

```java
// 加载 MySQL 驱动
Class.forName("com.mysql.cj.jdbc.Driver");
```

如果换成 Oracle，只需把参数换成 Oracle 对应的驱动类名。这样，更换数据库时主要改配置或类名，而不必修改加载逻辑。

#### 2. 根据配置文件加载类

Spring IOC 动态加载和管理 Bean，就大量依赖反射。

Spring 通过 XML 或 properties 配置 Bean 时，大致过程是：

1. 将 XML 或 properties 配置文件加载到内存；
2. 解析配置内容，得到 Bean 对应的类名和属性信息；
3. 使用反射，根据类名字符串获取对应的 `Class` 实例；
4. 创建对象，并动态设置属性。

这样，Spring 就能根据配置决定加载哪些 Bean、如何创建和装配它们，程序也更灵活、更易扩展。

## 注解

> 注解的原理、底层实现以及作用域

### 注解的原理

注解本质是一个继承 `Annotation` 的特殊接口，其具体实现类是Java运行时生成的动态代理类。

### 注解解析的底层实现

## 异常

> 异常体系，异常处理……



## Object

> 类内方法，==与equals，equals与hashcode，string常用方法，String与StringBuffer与StringBuilder



## 新特性

> Java8主要新特性（Lambda，Stream API，CompletableFuture…），Java21主要新特性



## 序列化

> 背景，如何实现



## 设计模式

> volatile和sychronized实现单例模式，代理模式与适配器模式，责任链模式及其使用场景，策略模式与责任链模式及其场景



## I/O

>NIO



## 其他


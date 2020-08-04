# Разработка расширенного конструктора таблицы
_Тестовое задание для фронт-енд разработчика в Conjoint.ly_

Результатом данного задания должен быть vue-компонент (с сетью вложенных компонентов) в виде конструктора таблицы, который принимает на вход данные и отрисовывает конструктор-таблицу. Часть задания уже выполнена.

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Text</th>
      <th>Image</th>
      <th>Number</th>
      <th><i>[Add column]</i></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Name 1</td>
      <td>Raw description text</td>
      <td><img height="15" src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png" alt="Image 1"></td>
      <td>42</td>
    </tr>
    <tr>
      <td>Name 2</td>
      <td>Raw description text 2</td>
      <td><img height="15" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRIbx6cBvdznxOwpCO0RK5zhHhWh0x08azCGzCtjpNUNkJZtq46&usqp=CAU" alt="Image 2"></td>
      <td>21</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th>Total</th>
      <th></th>
      <th></th>
      <th>63 <i>[Sum]<i></th>
    </tr>
    <tr>
      <th><i>[Add row]</i></th>
    </tr>
  </tfoot>
</table>

## Требования к таблице

- [x] Адаптивная верстка (при ресайзинге таблица должна растягиваться или сжиматься без багов, минимальная ширина 1024px)
- [x] Первая колонка имеет название Name, она не может быть удалена и значения в ней должны быть уникальными
- [ ] Каждая колонка имеет один из типов данных:
   - текст
   - ссылка на картинку (url)
   - число (double)
   - дата
   - процент
   - JSON
- [x] Формат отображения числа: `1,234,567.89`
- [ ] Формат отображения JSON в самой таблице - просто кусочек красивого кода. Но при нажатии показывается модалка, где есть крсиво раскрываемый объект
- [x] При клике на ячейку в колонке, ячейка переходит в режим редактирования и пользователь может поменять ее значение. При потере фокуса происходит валидация значения по типу данных, если все ок, то режим редактирования отключается, иначе показывает ошибка
- [x] В заголовке таблицы справа есть кнопка **_[Add column]_** - это кнопка-дропдаун с выбором типа значений колонки для добавления, выбрав тип, в конец таблицы добавляется новая колонка с пустыми ячейками.
- [x] В первой колонке, в последней строчке, находится кнопка **_[Add row]_**, которая добавляет новую строчку
- [x] Предпоследняя строка таблицы идет Total, которая пока будет использоваться для колонки с числовым типом.
- [ ] **_[Sum]_** - это кнопка-дропдаун (sum по-умолчанию), который производит подсчеты значений в колонке с типом Число. Пока нужно реализовать следующие алгоритмы:
  - `sum`  (нужна мягкая валидация: сумма процентов не должна быть больше 100)
  - `mean`
  - `median`
  - `min`
  - `max`
  - `count`
- [ ] Надо сделать колл-беки для:
  - Чтения данных из сервера или базы данных (При перезагрузке страницы данные берутся из БД)
  - Записи данных яйчейки (чтобы каждое изменение таблицы на "горячую" сохранялось в БД)
  - Добавление или удаление строк и столбцов
- [ ] Если не настроены колл-беки, сделать дефолтные, которые просто образаются к БД (Vuex + localstorage)
- [ ] Подготовить для npm, чтобы можно было вставлять в разные проекты (см. [как тут](https://www.freecodecamp.org/news/how-to-make-a-beautiful-tiny-npm-package-and-publish-it-2881d4307f78/))

## Требования к технологиям

* Фреймворк Vue.js (https://vuejs.org/)
* CSS-фреймворк Bootstrap4 (https://bootstrap-vue.org/)

## Условия выполнения задачи

* Оплата за выполненое задание в размере 7 тыс. руб.
* Срок: максимум 7 дней с оговоренного начала выполнения задания
* Согласие на [лицензию](LICENSE)

## Build Setup (уже готовой части проекта)

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

const create = (x = 0, y = 0) => ({ x, y });
const fromArray = ([ x, y ]) => ({ x, y });

const add = (v1, v2) => create(v1.x + v2.x, v1.y + v2.y);
const sub = (v1, v2) => create(v1.x - v2.x, v1.y - v2.y);
const mult = (v, scalar) => create(v.x * scalar, v.y * scalar);
const div = (v, scalar) => create(v.x / scalar, v.y / scalar);

module.exports = {
  create,
  fromArray,
  add,
  sub,
  mult,
  div,
}

import { describe, expect, it } from "vitest";
import { getInstructorsByCourse } from "./instructorRelations.js";

describe("getInstructorsByCourse", () => {
  const instructors = [
    { id: "1", name: "A", courses: ["c1", "c2"] },
    { id: "2", name: "B", courses: ["c2"] },
    { id: "3", name: "C", courses: "not-array" },
    { id: "4", name: "D" },
  ];

  it("devuelve instructores que listan el curso", () => {
    const r = getInstructorsByCourse("c2", instructors);
    expect(r.map((i) => i.id)).toEqual(["1", "2"]);
  });

  it("devuelve vacío si ningún instructor tiene el curso", () => {
    expect(getInstructorsByCourse("cx", instructors)).toEqual([]);
  });

  it("ignora entradas sin arreglo courses", () => {
    expect(getInstructorsByCourse("c2", [instructors[2], instructors[3]])).toEqual([]);
  });
});

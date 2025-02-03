import React from 'react';

const Part = ({ name, exercises }) => (
  <div>
    {name} {exercises}
  </div>
);

const Course = ({ course }) => {
  const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <div>
      <h1>{course.name}</h1>
      {course.parts.map(part => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
      <p><strong>Total exercises: {totalExercises}</strong></p>
    </div>
  );
};

export default Course;

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const _ = require('lodash');

/**Import data */
const courses = require('./samples/courses.json');
const students = require('./samples/students.json');
const grades = require('./samples/grades.json');

/**Import types */
const CourseType = require('./types/courses_types');
const StudentType = require('./types/students_types');
const GradeType = require('./types/grades_types');

 /**Las mutations permiten hacer una manipulacion de los datos */
 const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addCourse: {
            type: CourseType,
            description: 'Add a Course',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const course = {
                    id: courses.length + 1,
                    name: args.name,
                    description: args.description
                }
                courses.push(course)
                return course
            }
        },
        addStudent: {
            type: StudentType,
            description: 'Add a Student',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) },
                courseId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                /**Me fijo si existe el curso donde quiero agregar al estudiante */
                var existCourse = _.find(courses, function (o) {return o.id == args.courseId;});
                if (existCourse){
                const student = {
                    id: students.length + 1,
                    name: args.name,
                    lastname: args.lastname,
                    courseId: args.courseId
                    }
                    students.push(student)
                    return student
                }
                else {
                    return null;
                }
            }
        },
        addGrade: {
            type: GradeType,
            description: 'Add a Grade',
            args: {
                courseId: { type: GraphQLNonNull(GraphQLInt) },
                studentId: { type: GraphQLNonNull(GraphQLInt) },
                grade: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                /**Me fijo si existe el estudiante y el curso antes de agregar la nota */
                var existStudent = _.find(students, function (o) {return o.id == args.studentId;});
                var existCourse = _.find(courses, function (o) {return o.id == args.courseId;});
                if (existStudent && existCourse){
                    const grade = {
                    id: grades.length + 1,
                    courseId: args.courseId,
                    studentId: args.studentId,
                    grade: args.grade
                }
                grades.push(grade)
                return grade}
                else {
                    return null;
                }
            }
        },
        deleteCourse: {
            type: CourseType,
            description: 'Delete a Course',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                /**Si el curso no tiene estudiantes puedo eliminarlo */
                var haveStudent = students.find((student) => student.courseId === args.id);
                if (!haveStudent){
                    var deleted = courses[args.id - 1];
                    _.remove(courses,(course)=>{
                        return course.id == args.id
                    })
                    return deleted
                }
                else {
                    return null;
                }
            }
        },
        deleteStudent: {
            type: StudentType,
            description: 'Delete a Student',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                /**Chequeo si el estudiante existe */
                var existStudent = _.find(students, function (o) {return o.id == args.id;});
                /**Si el estudiante tiene notas no lo puedo eliminar */
                var haveGrades = grades.find((grade) => grade.studentId === args.id);
                if (existStudent && !haveGrades){
                    var deleted = students[args.id - 1];
                    _.remove(students,(student)=>{
                        return student.id == args.id
                    })
                    return deleted
                    
                }
                else {
                    return null;
                }
                
            }
        },
        deleteGrade: {
            type: GradeType,
            description: 'Delete a Grade',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                var deleted = grades[args.id - 1];
                _.remove(grades,(grade)=>{
                    return grade.id == args.id
                })
                return deleted
            }
        },
    })
})

module.exports = RootMutationType;
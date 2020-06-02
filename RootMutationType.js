const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLError
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
                /**Chequeo que no haya dos cursos con el mismo nombre */
                var duplicateName = courses.find(course => course.name === args.name);
                if (duplicateName){
                    throw new GraphQLError ('Ya hay un curso registrado con ese nombre')
                }
                else {
                    var newId = 1 ;
                    _.each(courses,(aux) =>{
                        newId = aux.id;
                    });
                    const course = {
                    id: newId + 1,
                    name: args.name,
                    description: args.description
                    }
                    courses.push(course)
                    return course
                }
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
                    var newId = 1 ;
                    _.each(students,(aux) =>{
                        newId = aux.id;
                    });
                    const student = {
                        id: newId + 1,
                        name: args.name,
                        lastname: args.lastname,
                        courseId: args.courseId
                        }
                    students.push(student)
                    return student
                }
                else {
                    throw new GraphQLError ('No hay un curso registrado que se corresponda con courseId')
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
                    var newId = 1 ;
                    _.each(grades,(aux) =>{
                        newId = aux.id;
                    });
                    const grade = {
                    id: newId+1,
                    courseId: args.courseId,
                    studentId: args.studentId,
                    grade: args.grade
                    }
                grades.push(grade)
                return grade
                }
                else if (!existStudent) {
                    throw new GraphQLError ('No hay un estudiante registrado que se corresponda con studentId')
                }
                else {
                    throw new GraphQLError ('No hay un curso registrado que se corresponda con courseId')
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
                /**Chequeo si el curso existe */
                var existCourse = _.find(courses, function (o) {return o.id == args.id;});
                /**Si el curso no tiene estudiantes puedo eliminarlo */
                var haveStudent = students.find((student) => student.courseId === args.id);
                if (existCourse){
                    if (!haveStudent){
                        _.remove(courses,(course)=>{
                            return course.id == args.id
                        })
                        return existCourse
                    }
                    else {
                        throw new GraphQLError ('El curso que intenta borrar tiene estudiantes asociados')
                    }
                }
                else {
                    throw new GraphQLError ('El curso que intenta borrar no esta registrado')
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
                if (existStudent){
                    if (!haveGrades){
                        _.remove(students,(student)=>{
                            return student.id == args.id
                        })
                        return existStudent
                    }
                    else {
                        throw new GraphQLError ('El estudiante que intenta eliminar tiene notas asociadas')
                    }
                }
                else {
                    throw new GraphQLError ('El estudiante que intenta eliminar no esta registrado')
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
                /**Chequeo si existe la nota que quiero eliminar */
                var existGrade = _.find(grades, function (o) {return o.id == args.id;});
                if (existGrade){
                    _.remove(grades,(grade)=>{
                        return grade.id == args.id
                    })
                    return existGrade
                }
                else {
                    throw new GraphQLError ('La nota que intenta borrar no esta registrada')
                }
            }
        },
    })
})

module.exports = RootMutationType;
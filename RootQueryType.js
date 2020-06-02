const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLError
} = require('graphql');

/**Import data */
const courses = require('./samples/courses.json');
const students = require('./samples/students.json');
const grades = require('./samples/grades.json');

/**Import types */
const CourseType = require('./types/courses_types');
const StudentType = require('./types/students_types');
const GradeType = require('./types/grades_types');

/**Las querys definen como vamos a consultar los datos
 * Es una representacion de la consulta
 */
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        courses: {
            /**Especifico que la query de courses va a devolver una lista 
             * y le especifico de que tipo es
             */
            type: new GraphQLList(CourseType),
            description: 'List of All Courses',
            resolve: () => courses
        },
        students: {
            type: new GraphQLList(StudentType),
            description: 'List of All Students',
            resolve: () => students
        },
        grades: {
            type: new GraphQLList(GradeType),
            description: 'List of All Grades',
            resolve: () => grades
        },
        course: {
            type: CourseType,
            description: 'Particular Course',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                var existCourse = courses.find(course => course.id === args.id);
                if (existCourse){
                    return existCourse;
                }
                else {
                    throw new GraphQLError ('No hay un curso registrado con ese id')
                }
            }
        },
        student: {
            type: StudentType,
            description: 'Particular Student',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                var existStudent = students.find(student => student.id === args.id);
                if (existStudent){
                    return existStudent;
                }
                else {
                    throw new GraphQLError ('No hay un estudiante registrado con ese id')
                }
            
            }
        },
        grade: {
            type: GradeType,
            description: 'Particular Grade',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                var existGrade = grades.find(grade => grade.id === args.id);
                if (existGrade){
                    return existGrade
                }
                else {
                    throw new GraphQLError ('No hay un curso registrado con ese id')
                }
            }
        },
    }),
});

module.exports = RootQueryType;
const express = require("express");
const app = express();

/**Agregamos express-graphql */
const expressGraphQL = require("express-graphql");

const {
    GraphQLSchema
} = require('graphql');

/**Import data */
const courses = require('./samples/courses.json');
const students = require('./samples/students.json');
const grades = require('./samples/grades.json');

/**Import types */
const CourseType = require('./types/courses_types');
const StudentType = require('./types/students_types');
const GradeType = require('./types/grades_types');

/**Import querys */
const RootQueryType = require('./RootQueryType');

/**Import mutations */
const RootMutationType = require ('./RootMutationType');

/**El esquema son las partes que componen la creacion del 
 * servicio graphql. Guarda las querys
 */
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

/**El graphiql en true permite ver la interfaz grafica y documentacion */
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(3000, () => {
  console.log("Server running");
});

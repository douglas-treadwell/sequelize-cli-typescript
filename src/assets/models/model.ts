import { Sequelize } from 'sequelize';
import sequelize from '@configs/database';

<%
  function getType(dataType) {
    dataType = dataType.toLowerCase();

    if ( ['tinyint', 'smallint', 'mediumint', 'integer', 'bigint', 'float', 'double', 'decimal', 'real'].indexOf(dataType) !== -1 ) {
      return 'number;';
    }

    if ( ['char', 'string', 'text', 'blob'].indexOf(dataType) !== -1 ) {
      return 'string;';
    }

    if ( ['date'].indexOf(dataType) !== -1 ) {
      return 'Date;';
    }

    if ( ['dateonly', 'time', 'now', 'json', 'jsonb'].indexOf(dataType) !== -1 ) {
      return 'string;  // actually a ' + dataType + ' column';
    }

    if ( ['enum'].indexOf(dataType) !== -1 ) {
      return "string;  // replace with 'validValue1' | 'validValue2', ...";
    }

    if ( ['boolean'].indexOf(dataType) !== -1 ) {
      return 'boolean;';
    }

    if ( ['uuid', 'uuidv1', 'uuidv4'].indexOf(dataType) !== -1 ) {
      return 'string;';
    }

    return dataType;
  }
%>

export type <%= name[0].toUpperCase() + name.substr(1) %>Attributes = {
  <% attributes.forEach((attribute) => {
  %><%= attribute.fieldName %>?: <%= getType(attribute.dataType) %>
  <%
  }) %>
}

export type <%= name[0].toUpperCase() + name.substr(1) %>Instance = {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  <% attributes.forEach((attribute) => {
  %><%= attribute.fieldName %>: <%= getType(attribute.dataType) %>
  <%
  }) %>
}

const init = (sequelize: Sequelize) => {
  const <%= name %> = sequelize.define('<%= name %>', {
    <% attributes.forEach(function(attribute, index) { %><%= attribute.fieldName %>: Sequelize.<%= attribute.dataFunction ? `${attribute.dataFunction.toUpperCase()}(DataTypes.${attribute.dataType.toUpperCase()})` : attribute.dataType.toUpperCase() %><%= (Object.keys(attributes).length - 1) > index ? ',' : '' %><% }) %>
  }<%= underscored ? ', { underscored: true }' : '' %>);

  <%= name %>.associate = (models) => {
    // associations can be defined here
  };

  return <%= name %>;
};

export default init(sequelize)

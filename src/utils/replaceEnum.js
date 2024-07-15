// Сейчас этот метод не используется, но в модели используется тип ENUM, поэтому он может пригодиться в дальнейшем
/**
 * Since PostgreSQL still does not support remove values from an ENUM,
 * the workaround is to create a new ENUM with the new values and use it
 * to replace the other.
 *
 * @param {string} tableName
 * @param {string} columnName
 * @param {string} defaultValue
 * @param {array}  newValues
 * @param {object} queryInterface
 * @param {string} [enumName='enum_<tableName>_<columnName>']
 *
 * @returns {Promise}
 */
export function replaceEnum({
  tableName,
  columnName,
  defaultValue,
  newValues,
  queryInterface,
  enumName = `enum_${tableName}_${columnName}`,
}) {
  const newEnumName = `${enumName}_new`;

  return queryInterface.sequelize.transaction(async (t) => {
    // Create a copy of the type
    await queryInterface.sequelize.query(`
      CREATE TYPE "${newEnumName}"
        AS ENUM ('${newValues.join('\', \'')}')
    `, { transaction: t });

    if (defaultValue) {
    // Drop default value (ALTER COLUMN cannot cast default values)
      await queryInterface.sequelize.query(`
      ALTER TABLE "${tableName}"
        ALTER COLUMN "${columnName}"
          DROP DEFAULT
      `, { transaction: t });
    }

    // Change column type to the new ENUM TYPE
    await queryInterface.sequelize.query(`
      ALTER TABLE "${tableName}"
        ALTER COLUMN "${columnName}"
          TYPE "${newEnumName}"
          USING ("${columnName}"::text::"${newEnumName}")
      `, { transaction: t });

    // Drop old ENUM
    await queryInterface.sequelize.query(`
      DROP TYPE "${enumName}"
      `, { transaction: t });

    // Rename new ENUM name
    await queryInterface.sequelize.query(`
      ALTER TYPE "${newEnumName}"
        RENAME TO "${enumName}"
      `, { transaction: t });

    if (defaultValue) {
      await queryInterface.sequelize.query(`
      ALTER TABLE "${tableName}"
        ALTER COLUMN "${columnName}"
          SET DEFAULT '${defaultValue}'::"${enumName}"
      `, { transaction: t });
    }
  });
}

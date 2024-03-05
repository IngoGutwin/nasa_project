function keplerPlanetsTableSql() {
  return `
    CREATE TABLE IF NOT EXISTS kepler_exoplaneten (
    kepid INT,
    kepoi_name VARCHAR(255),
    kepler_name VARCHAR(255) PRIMARY KEY,
    koi_disposition VARCHAR(255),
    koi_pdisposition VARCHAR(255),
  koi_score VARCHAR(255),
  koi_fpflag_nt VARCHAR(1),
  koi_fpflag_ss VARCHAR(1),
  koi_fpflag_co VARCHAR(1),
  koi_fpflag_ec VARCHAR(1),
  koi_period VARCHAR(255),
  koi_period_err1 VARCHAR(255),
  koi_period_err2 VARCHAR(255),
  koi_time0bk VARCHAR(255),
  koi_time0bk_err1 VARCHAR(255),
  koi_time0bk_err2 VARCHAR(255),
  koi_impact VARCHAR(255),
  koi_impact_err1 VARCHAR(255),
  koi_impact_err2 VARCHAR(255),
  koi_duration VARCHAR(255),
  koi_duration_err1 VARCHAR(255),
  koi_duration_err2 VARCHAR(255),
  koi_depth VARCHAR(255),
  koi_depth_err1 VARCHAR(255),
  koi_depth_err2 VARCHAR(255),
  koi_prad VARCHAR(255),
  koi_prad_err1 VARCHAR(255),
  koi_prad_err2 VARCHAR(255),
  koi_teq VARCHAR(255),
  koi_teq_err1 VARCHAR(255),
  koi_teq_err2 VARCHAR(255),
  koi_insol VARCHAR(255),
  koi_insol_err1 VARCHAR(255),
  koi_insol_err2 VARCHAR(255),
  koi_model_snr VARCHAR(255),
  koi_tce_plnt_num VARCHAR(255),
  koi_tce_delivname VARCHAR(255),
  koi_steff VARCHAR(255),
  koi_steff_err1 VARCHAR(255),
  koi_steff_err2 VARCHAR(255),
  koi_slogg VARCHAR(255),
  koi_slogg_err1 VARCHAR(255),
  koi_slogg_err2 VARCHAR(255),
  koi_srad VARCHAR(255),
  koi_srad_err1 VARCHAR(255),
  koi_srad_err2 VARCHAR(255),
  ra VARCHAR(255),
  declination VARCHAR(255) NOT NULL,
  koi_kepmag VARCHAR(255)
  )
  `;
}

/**
  * the dec value is an reserved value in mariadb
  * so it should be replaced
  */
function replaceTableValue(arr) {
  return arr.map(item => {
    if (item === 'dec') return item = 'declination';
    return item;
  });
}

function getValuesString(values) {
  let result = '';
  for (let i = 0; i < values; i++) {
    if (i === 48) return result += '?';
    result += '?,';
  }
  return result;
}

function generateInsertSqlQuery(tablename, targetValues) {
  let tableValues = replaceTableValue(Object.keys(targetValues));
  let sqlResult =
    `INSERT INTO ${tablename} (${tableValues.join(', ')}) VALUE (${getValuesString(tableValues.length)})`;
  return sqlResult;
}

module.exports = {
  keplerPlanetsTableSql,
  generateInsertSqlQuery,
};

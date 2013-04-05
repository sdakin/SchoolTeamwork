<?php

require_once 'db.php';

class DBObject {
	//-------------------------------------------------------------------------
	// properties
	
	public $data;
	public $exists;
	
	//-------------------------------------------------------------------------
	// public interface
	
	function __construct($initData) {
		$this->data = $initData;
	}
}

class DBManager {
	//-------------------------------------------------------------------------
	// properties
	
	private $dbo;
	private $tableName;
	private $columns;
	
	//-------------------------------------------------------------------------
	// public interface
	
	function __construct($initTableName) {
		$this->dbo = dboConnect();
		$this->tableName = $initTableName;
	}
	
	public function objectExists($obj, $keyColumns) {
		if (isset($obj->exists))
			return $obj->exists;
		else {
			$exists = false;
			$info = $this->getWhereClauseInfo($obj, $keyColumns);
			if (strlen($info->whereClause) > 0) {
				$statement = $this->dbo->prepare("SELECT COUNT(*) FROM " . $this->tableName . 
													" WHERE " . $info->whereClause);
				$statement->execute($info->params);
				$exists = $statement->fetchColumn() > 0;
			}
			$obj->exists = $exists;
			return $exists;
		}
	}
	
	// returns an array if multiple objects are found, a single object if only one
	// object is found, or null if no objects are found.
	public function readObjects($searchObj) {
		$result = null;
		$keyColumns = array();
		if ($searchObj) {
			foreach ($searchObj->data as $key => $value)
	 		  $keyColumns[] = $key;
		}
		if (count($keyColumns) > 0) {
			$info = $this->getWhereClauseInfo($searchObj, $keyColumns);
			if (strlen($info->whereClause) > 0) {
				$sql = "SELECT * FROM " . $this->tableName . " WHERE " . $info->whereClause;
				$statement = $this->dbo->prepare($sql);
				$statement->execute($info->params);
			}
		} else {	// no keyColumns results in a select all
			$sql = "SELECT * FROM " . $this->tableName;
			$statement = $this->dbo->prepare($sql);
			$statement->execute();
		}

		if (isset($statement)) {
			if ($statement->errorCode() == 0) {
				$count = $statement->rowCount();
				if ($count == 1) {
					$result = $statement->fetch(PDO::FETCH_ASSOC);
				} else if ($count > 1) {
					$result = $statement->fetchAll(PDO::FETCH_ASSOC);
				}
			}
		}
		return $result;
	}

	public function saveObject($obj, $keyColumns) {
		$result->status = 500;		// assume failure
		
		if (!isset($this->columns))
			$this->loadColumns();
		if (!isset($obj->exists))
			$this->objectExists($obj, $keyColumns);
		
		// set up the data to be saved
		$setClause = "";
		$params = array();
		foreach ($obj->data as $colName => $value) {
			if (in_array($colName, $this->columns)) {
				$varName = ":" . $colName;
				if (strlen($setClause) > 0) $setClause .= ",";
				$setClause .= $colName . "=" . $varName;
				$params[$varName] = $value;
			}
		}
		
		// prepare and execute the sql statement
		$sql = "";
		if (strlen($setClause) > 0) {
			if ($obj->exists) {
				$info = $this->getWhereClauseInfo($obj, $keyColumns);
				if (strlen($info->whereClause) > 0)
					$sql = "UPDATE " . $this->tableName . " SET " . $setClause . " WHERE " . $info->whereClause;
			} else {
				$sql = "INSERT " . $this->tableName . " SET " . $setClause;
			}
		}
		
		if (strlen($sql) > 0) {
			$statement = $this->dbo->prepare($sql);
			$statement->execute($params);
			if ($statement->errorCode() == 0) {
				$result->status = 200;
				if (isset($obj->data->id))
					$result->id = $obj->data->id;
				if (!$obj->exists && !isset($result->id)) {
					$result->id = $this->dbo->lastInsertId();
				}
//				$result->sql = $sql;	// *** DEBUGGING
			} else {
				$result->pdoError = $statement->errorInfo();
				$result->sql = $sql;
//				$result->params = print_r($params, true);
			}
		}
		
		return $result;
	}
	
	//-------------------------------------------------------------------------
	// private interface
	
	private function loadColumns() {
		// get the table columns so we can be sure we only insert/update valid columns
		$query = $this->dbo->prepare("DESCRIBE " . $this->tableName);
		$query->execute();
		$this->columns = $query->fetchAll(PDO::FETCH_COLUMN);
	}
	
	private function getWhereClauseInfo($obj, $keyColumns) {
		$result->whereClause = "";
		$result->params = array();
		
		if (isset($keyColumns)) {
			if (is_array($keyColumns)) {
				foreach ($keyColumns as $colName) {
					if (strlen($result->whereClause) > 0) $result->whereClause .= " AND ";
					$result->whereClause .= "$colName=:$colName";
					$result->params[":$colName"] = $obj->data->$colName;
				}
			} else {
				$result->whereClause = "$keyColumns=:$keyColumns";
				$result->params[":$keyColumns"] = $obj->data->$keyColumns;
			}
		} else {
			$result->whereClause = "id=:id";
			$result->params[":id"] = $obj->data["id"];
		}
		return $result;
	}
}

?>

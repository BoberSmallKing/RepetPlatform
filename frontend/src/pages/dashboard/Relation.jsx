import { useEffect, useState } from "react";
import { relationService } from "../../services/relationService";

function Relation() {
  const [relations, setRelation] = useState([]);

  useEffect(() => {
    setRelation(relationService.list());
  }, []);
  return <h1>This is main page</h1>;
}

export default Relation;

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Badge from "../../components/Badge/Badge";
import type { BadgeColor } from "../../components/Badge/Badge";
import { Plus } from "lucide-react";
import { Button } from "../../components/Button/Button";
import PageSection from "../../components/PageSection/PageSection";
import Select from "../../components/Select/Select";
import "./ParameterCrudPage.scss";

type ParameterCrudMode = "new" | "edit" | "delete";

type ParameterCrudPageProps = {
  mode: ParameterCrudMode;
};

type DomainOption = {
  id: string;
  label: string;
  color: BadgeColor;
};

const domainOptions: DomainOption[] = [
  { id: "production", label: "Production", color: "primary" },
  { id: "batch", label: "Batch", color: "danger" },
  { id: "machine-event", label: "Machine Event", color: "warning" },
];

const dataTypeOptions = [
  { value: "boolean", label: "Boolean" },
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
];

export default function ParameterCrudPage({ mode }: ParameterCrudPageProps) {
  const { t } = useTranslation("pages");
  const navigate = useNavigate();

  const [name, setName] = useState(mode === "new" ? "" : "BatchStart");
  const [dataType, setDataType] = useState(mode === "new" ? "boolean" : "boolean");
  const [selectedDomains] = useState<string[]>(
    mode === "new" ? ["production"] : ["production", "batch"]
  );

  const title = useMemo(() => {
    if (mode === "new") return t("parameterCrud.newTitle");
    if (mode === "edit") return t("parameterCrud.editTitle");
    return t("parameterCrud.deleteTitle");
  }, [mode, t]);

  const submitLabel = useMemo(() => {
    if (mode === "new") return t("parameterCrud.actions.create");
    if (mode === "edit") return t("parameterCrud.actions.save");
    return t("parameterCrud.actions.delete");
  }, [mode, t]);

  const isDelete = mode === "delete";

  const selectedDomainBadges = useMemo(
    () => domainOptions.filter((option) => selectedDomains.includes(option.id)),
    [selectedDomains]
  );

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();
    navigate("/parameters");
  };

  return (
    <PageSection title={title} description={t("parameterCrud.description")}>
      <form className="parameter-crud" onSubmit={handleSubmit}>
        <div className="parameter-crud__field parameter-crud__field--domains">
          <div className="parameter-crud__label-row">
            <span className="parameter-crud__label">{t("parameterCrud.fields.capabilityDomain")}</span>
            {!isDelete && 
              <Button size="sm" variant="secondary" type="button" icon={Plus} onClick={() => { /* Add domain logic */ }}>
                {t("parameterCrud.actions.addCapabilityDomain")}
              </Button>
            }
          </div>
          <div className="parameter-crud__badges" role="group" aria-label={t("parameterCrud.fields.capabilityDomain")}>
            {selectedDomainBadges.map((option) => (
              <Badge key={option.id} color={option.color}>
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        <label className="parameter-crud__field" htmlFor="parameter-name-input">
          <span className="parameter-crud__label">{t("parameterCrud.fields.name")}</span>
          <input
            id="parameter-name-input"
            className="parameter-crud__input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isDelete}
            required
          />
        </label>

        <label className="parameter-crud__field" htmlFor="parameter-data-type-select">
          <span className="parameter-crud__label">{t("parameterCrud.fields.dataType")}</span>
          <Select
            id="parameter-data-type-select"
            options={dataTypeOptions}
            value={dataType}
            onChange={(event) => setDataType(event.target.value)}
            size="sm"
            disabled={isDelete}
          />
        </label>

        {isDelete && <p className="parameter-crud__warning">{t("parameterCrud.deleteWarning")}</p>}

        <div className="parameter-crud__footer">
          <Button type="button" variant="ghost" onClick={() => navigate("/parameters")}>
            {t("parameterCrud.actions.cancel")}
          </Button>
          <Button type="submit" variant={isDelete ? "danger" : "primary"}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </PageSection>
  );
}

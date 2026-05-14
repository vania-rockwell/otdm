import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import type { BadgeColor } from "../../components/Badge/Badge";
import type { TableColumn } from "../../components/Table/Table";
import Table from "../../components/Table/Table";
import PageSection from "../../components/PageSection/PageSection";
import { fetchParametersTable, type ParameterTableRow } from "../../services/parametersService";
import "./ParametersPage.scss";

export default function ParametersPage() {
  const { t } = useTranslation("pages");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ParameterTableRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setLoadError(null);

    void fetchParametersTable({ signal: controller.signal })
      .then((responseRows) => {
        setRows(responseRows);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setLoadError(t("parameters.loadError"));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [t]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (normalizedSearch.length === 0) {
      return rows;
    }

    return rows.filter((row) => {
      const searchable = `${row.capabilityDomain} ${row.name} ${row.dataType}`.toLowerCase();
      return searchable.includes(normalizedSearch);
    });
  }, [search, rows]);

  const columns: TableColumn<ParameterTableRow>[] = [
    {
      key: "capabilityDomain",
      header: t("parameters.table.headers.capabilityDomain"),
    },
    {
      key: "name",
      header: t("parameters.table.headers.name"),
    },
    {
      key: "dataType",
      header: t("parameters.table.headers.dataType"),
    },
    {
      key: "contexts",
      header: t("parameters.table.headers.contexts"),
      render: (value) => {
        const badges = value as ParameterTableRow["contexts"];

        return (
          <div className="parameters-page__context-badges">
            {badges.map((badge, index) => (
              <Badge key={`${badge.label}-${badge.color}-${index}`} color={badge.color as BadgeColor}>
                {badge.label}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      key: "id",
      header: t("parameters.table.headers.actions"),
      align: "center",
      render: (_value, row) => (
        <div className="parameters-page__actions-cell">
          <Button
            variant="secondary"
            size="sm"
            icon={Pencil}
            onClick={() => navigate(`/parameters/${row.id}/edit`)}
          />
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => navigate(`/parameters/${row.id}/delete`)}
          />
        </div>
      ),
    },
  ];

  return (
    <PageSection
      title={t("parameters.title")}
      description={t("parameters.description")}
    >
      <div className="parameters-page">
        <div className="parameters-page__toolbar">
          <input
            type="search"
            className="parameters-page__search"
            placeholder={t("parameters.searchPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label={t("parameters.searchAria")}
          />

          <Button variant="secondary" size="sm" onClick={() => navigate("/parameters/new")} icon={Plus}>
            {t("parameters.actions.addNew")}
          </Button>
        </div>

        <Table
          columns={columns}
          rows={filteredRows}
          rowKey="id"
          emptyLabel={t("parameters.table.empty")}
        />

        {isLoading && <p className="parameters-page__state">{t("parameters.loading")}</p>}
        {loadError !== null && !isLoading && (
          <p className="parameters-page__state parameters-page__state--error">{loadError}</p>
        )}
      </div>
    </PageSection>
  );
}

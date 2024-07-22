import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoadingButton from "../../../components/LoadingButton";
import InputErrorMessage from "../../../components/InputErrorMessage";
import { fetchWithCredentials } from "../../../utils/fetchFn";

const InlinePermissionCreate = ({ setShowForm }) => {
  const { id } = useParams();
  const client = useQueryClient();

  const { register, handleSubmit, formState, setValue } = useForm({
    defaultValues: {
      route_id: 0,
    },
  });

  const [selectedService, setSelectedService] = useState(0);
  const [selectedResource, setSelectedResource] = useState(0);

  const { data: services } = useQuery({
    queryKey: ["services-permission"],
    queryFn: () =>
      fetchWithCredentials("/services", "GET").then((data) => data.services),
  });

  const { data: resources, refetch: refetchResources } = useQuery({
    queryKey: ["resources-permission", selectedService],
    queryFn: () => {
      if (selectedService != 0)
        return fetchWithCredentials(
          `/services/${selectedService}/resources`,
          "GET"
        ).then((data) => data.resources);
      else return [];
    },
  });

  const { data: routes, refetch: refetchRoutes } = useQuery({
    queryKey: ["routes-permission", selectedResource],
    queryFn: () => {
      if (selectedResource != 0)
        return fetchWithCredentials(
          `/resources/${selectedResource}/routes`,
          "GET"
        ).then((data) => data.routes);
      else return [];
    },
  });

  const { isPending: isCreating, mutate } = useMutation({
    mutationFn: (data) =>
      fetchWithCredentials(`/roles/${id}/permissions`, "POST", data),
    onSuccess: () => {
      client.invalidateQueries(["role-permissions", id]);
      toast.success("Permission created successfully");
    },
  });

  const onServiceChange = (e) => {
    setSelectedService(e.target.value);
    setSelectedResource(0);
    refetchResources();
  };

  const onResourceChange = (e) => {
    setSelectedResource(e.target.value);
    setValue("route_id", 0);
    refetchRoutes();
  };

  const onSubmit = (data) => {
    mutate({
      service_id: parseInt(selectedService),
      route_id: parseInt(data.route_id),
      is_allow: data.is_allow === "true" ? true : false,
    });
  };

  return (
    <div className="border border-base-content rounded-lg my-6">
      <h2 className="font-semibold px-6 mt-3">New Permissions</h2>
      <form
        className="flex flex-wrap items-end justify-between py-4 px-4 mx-1 gap-3"
        autoComplete="on"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-wrap gap-3 items-center overflow-auto">
          <select
            className="select select-bordered select-sm max-w-xs"
            onChange={onServiceChange}
            value={selectedService}
          >
            <option disabled value={0}>
              Service
            </option>
            {services?.length > 0 ? (
              services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.domain})
                </option>
              ))
            ) : (
              <option disabled>No services found</option>
            )}
          </select>
          <select
            className="select select-bordered select-sm max-w-xs"
            onChange={onResourceChange}
            value={selectedResource}
          >
            <option disabled value={0}>
              Resource
            </option>
            {resources?.length > 0 ? (
              resources?.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))
            ) : (
              <option disabled>No resources found</option>
            )}
          </select>

          <select
            className="select select-bordered select-sm max-w-xs"
            id="route_id"
            {...register("route_id", {
              validate: (value) =>
                value.toString() !== "0" || "Route is required",
            })}
          >
            <option disabled value={0}>
              Routes
            </option>
            {routes?.length > 0 ? (
              routes?.map((route) => (
                <option key={route.id} value={route.id}>
                  {`${route.method} ${route.path}`}
                </option>
              ))
            ) : (
              <option disabled>No routes found</option>
            )}
          </select>
          <select
            className="select select-bordered select-sm max-w-xs"
            {...register("is_allow")}
          >
            <option value={true} className="text-green-600">
              Allow
            </option>
            <option value={false} className="text-red-600">
              Deny
            </option>
          </select>
          <InputErrorMessage message={formState.errors?.route_id?.message} />
        </div>
        <div>
          <button
            className="btn btn-ghost btn-circle rounded-lg btn-sm"
            type="reset"
            onClick={() => setShowForm(false)}
          >
            <XCircleIcon className="text-base-content w-5 h-5" />
          </button>
          <button
            className="btn btn-ghost btn-circle rounded-lg btn-sm"
            type="submit"
            disabled={isCreating}
          >
            <LoadingButton isLoading={isCreating}>
              <CheckCircleIcon className="text-primary w-5 h-5" />
            </LoadingButton>
          </button>
        </div>
      </form>
    </div>
  );
};
InlinePermissionCreate.propTypes = {
  setShowForm: PropTypes.func.isRequired,
};

export default InlinePermissionCreate;

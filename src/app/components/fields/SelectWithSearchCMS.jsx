"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Image from "next/image";
import dynamic from "next/dynamic";

// Import Select dynamically to prevent SSR issues
const DynamicSelect = dynamic(() => import("react-select"), { ssr: false });

export default function MultipleSelectUser({
  nameSelect,
  idSelect,
  placeholderSelect,
  widthSelect,
  userItemList,
  onChange,
  value,
}) {
  const [userOptions, setUserOptions] = useState([]);

  // Mapping data dari userItemList ke format yang diinginkan
  useEffect(() => {
    const options = userItemList.map((post, index) => ({
      key: index,
      value: post.id,
      label: post.full_name,
      avatar: post.avatar,
    }));

    setUserOptions(options);
  }, [userItemList]);
  x;

  // Styling select
  const customStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#FFFFFF",
      border: "0",
      borderRadius: "10px",
      padding: "4px",
      ":hover": { backgroundColor: "#F1F2F4" },
    }),
    option: (styles, { isSelected }) => ({
      ...styles,
      color: isSelected ? "#09090B" : "#09090B",
      cursor: "pointer",
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "none",
      borderRadius: "100vw",
      padding: "6px",
      border: "1px solid #CBD5E1",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#09090B",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "#09090B",
      ":hover": {
        backgroundColor: "#FFCDC9",
        color: "#E62314",
      },
    }),
  };

  return (
    <DynamicSelect
      isMulti
      placeholder={placeholderSelect}
      id={idSelect}
      name={nameSelect}
      options={userOptions}
      styles={customStyles}
      className={`basic-multi-select ${widthSelect} text-sm bg-transparent font-main font-medium`}
      classNamePrefix="select"
      value={userOptions.filter((option) =>
        value?.split(",").includes(String(option.value))
      )}
      onChange={(selectedOptions) =>
        onChange(selectedOptions.map((option) => option.value).join(","))
      }
      components={{
        Option: ({ data, innerRef, innerProps, isSelected, isFocused }) => (
          <div
            ref={innerRef}
            {...innerProps}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px",
              backgroundColor: isSelected
                ? "#CDD9FF"
                : isFocused
                ? "#E9F1FF"
                : undefined,
              fontSize: "14px",
            }}
          >
            <Image
              src={data.avatar}
              alt={data.label}
              width={1200}
              height={1200}
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
                flexGrow: 1,
              }}
            >
              {data.label}
            </div>
          </div>
        ),
        MultiValueLabel: ({ data }) => (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Image
              src={data.avatar}
              alt={data.label}
              width={1200}
              height={1200}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
                flexGrow: 1,
                fontSize: "14px",
              }}
            >
              {data.label}
            </div>
          </div>
        ),
      }}
    />
  );
}

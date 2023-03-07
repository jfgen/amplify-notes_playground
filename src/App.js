import { useState } from "react";
import "./App.css";
import {
  CreateNote,
  NavBar,
  NoteUICollection,
  UpdateNote,
} from "./ui-components";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { DataStore } from "aws-amplify";
import { Hub } from "aws-amplify";

function App({ signOut }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateNote, setUpdateNote] = useState();

  Hub.listen("ui", (capsule) => {
    if (capsule.payload.event === "actions:datastore:create:finished") {
      setShowCreateModal(false);
    }
    if (capsule.payload.event === "actions:datastore:update:finished") {
      setShowUpdateModal(false);
    }
  });

  return (
    <>
      <NavBar
        width="100%"
        marginBottom="20px"
        overrides={{
          Button31632483: { onClick: () => setShowCreateModal(true) },
          Button31632487: {
            onClick: async () => {
              await DataStore.clear();
              signOut();
            },
          },
        }}
      />
      <div className="container">
        <NoteUICollection
          overrideItems={({ item, index }) => {
            return {
              overrides: {
                EditButton: {
                  onClick: () => {
                    setUpdateNote(item);
                    setShowUpdateModal(true);
                  },
                },
              },
            };
          }}
        />
      </div>
      <div
        className="modal"
        style={{ display: showCreateModal === false && "none" }}
      >
        <CreateNote
          overrides={{
            MyIcon: {
              as: "button",
              onClick: () => setShowCreateModal(false),
            },
          }}
        />
      </div>
      <div
        className="modal"
        style={{ display: showUpdateModal === false && "none" }}
      >
        <UpdateNote
          note={updateNote}
          overrides={{
            MyIcon: {
              as: "button",
              onClick: () => {
                setShowUpdateModal(false);
                setUpdateNote();
              },
            },
          }}
        />
      </div>
    </>
  );
}

export default withAuthenticator(App);

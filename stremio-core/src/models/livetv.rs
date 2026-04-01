use serde::{Deserialize, Serialize};

use crate::{
    models::ctx::Ctx,
    runtime::{
        msg::{Action, ActionLoad, Msg},
        Effects, Env, UpdateWithCtx,
    },
};

pub type Selected = Option<String>;

#[derive(Default, Clone, PartialEq, Eq, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LiveTv {
    pub url: Option<String>,
}

impl<E: Env + 'static> UpdateWithCtx<E> for LiveTv {
    fn update(&mut self, msg: &Msg, _ctx: &Ctx) -> Effects {
        match msg {
            Msg::Action(Action::Load(ActionLoad::LiveTv(selected))) => {
                self.url = selected.clone();
                Effects::none().unchanged()
            }
            Msg::Action(Action::Unload) => {
                self.url = None;
                Effects::none().unchanged()
            }
            _ => Effects::none().unchanged(),
        }
    }
}

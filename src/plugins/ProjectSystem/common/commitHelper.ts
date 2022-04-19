import {
  changeStatusEnum,
  TrackingChangeModel,
} from '../services/common';

import {
  PlannerCommit,
  PlannerTrackingChangeModel,
  DesignerCommit,
  DesignerTrackingChangeModel,
  EstimatorCommit,
  EstimatorTrackingChangeModel,
  SupervisorCommit,
  SupervisorTrackingChangeModel,
} from '../services/commit';

import {
  ElementModel,
  CommittedElementModel,
} from '../services/element';

import {
  ClusterViewModel,
  CommittedClusterModel,
} from '../services/cluster';

import {
  ElementClusterViewModel,
  CommittedElementClusterModel,
} from '../services/elementCluster';

import {
  ItemViewModel,
  CommittedItemModel,
} from '../services/item';

import {
  ResourceViewModel,
  CommittedResourceModel,
} from '../services/resource';

import {
  ConfirmationModel,
  CommittedConfirmationModel,
} from '../services/confirmation';

const getCommitterElements = (data: TrackingChangeModel<ElementModel>[]): CommittedElementModel[] => {
  return data.map(e => {
    if (e.pack === null && e.post !== null)
      return {
        code: e.post.code,
        commitNumber: 0,
        description: e.post.description,
        finish: e.post.finish,
        level: e.post.level,
        projectCode: e.post.projectCode,
        start: e.post.start,
        status: changeStatusEnum.DELETE,
      };

    if (e.pack !== null && e.post === null)
      return {
        code: e.pack.code,
        commitNumber: 0,
        description: e.pack.description,
        finish: e.pack.finish,
        level: e.pack.level,
        projectCode: e.pack.projectCode,
        start: e.pack.start,
        status: changeStatusEnum.CREATE,
      };

    if (e.pack !== null && e.post !== null)
      return {
        code: e.pack.code,
        commitNumber: 0,
        description: e.pack.description,
        finish: e.pack.finish,
        level: e.pack.level,
        projectCode: e.pack.projectCode,
        start: e.pack.start,
        status: changeStatusEnum.UPDATE,
      };

    return {
      code: '',
      commitNumber: 0,
      description: '',
      finish: new Date(),
      level: 1,
      projectCode: '',
      start: new Date(),
      status: changeStatusEnum.UPDATE,
    };
  })
}

const getCommitterClusters = (data: TrackingChangeModel<ClusterViewModel>[]): CommittedClusterModel[] => {
  return data.map(e => {
    if (e.pack === null && e.post !== null)
      return {
        code: e.post.code,
        commitNumber: 0,
        description: e.post.description,
        projectCode: e.post.projectCode,
        note: e.post.note,
        filePath: e.post.filePath,
        status: changeStatusEnum.DELETE,
      };

    if (e.pack !== null && e.post === null)
      return {
        code: e.pack.code,
        commitNumber: 0,
        description: e.pack.description,
        projectCode: e.pack.projectCode,
        note: e.pack.note,
        filePath: e.pack.filePath,
        status: changeStatusEnum.CREATE,
      };

    if (e.pack !== null && e.post !== null)
      return {
        code: e.pack.code,
        commitNumber: 0,
        description: e.pack.description,
        projectCode: e.pack.projectCode,
        note: e.pack.note,
        filePath: e.pack.filePath,
        status: changeStatusEnum.UPDATE,
      };

    return {
      code: '',
      commitNumber: 0,
      description: '',
      projectCode: '',
      note: '',
      filePath: '',
      status: changeStatusEnum.UPDATE,
    };
  })
}

const getCommitterElementClusters = (data: TrackingChangeModel<ElementClusterViewModel>[]): CommittedElementClusterModel[] => {
  return data.map(e => {
    if (e.pack === null && e.post !== null)
      return {
        elementCode: e.post.elementCode,
        clusterCode: e.post.clusterCode,
        quantity: e.post.quantity,
        commitNumber: 0,
        projectCode: e.post.projectCode,
        status: changeStatusEnum.DELETE,
      };

    if (e.pack !== null && e.post === null)
      return {
        elementCode: e.pack.elementCode,
        clusterCode: e.pack.clusterCode,
        quantity: e.pack.quantity,
        commitNumber: 0,
        projectCode: e.pack.projectCode,
        status: changeStatusEnum.CREATE,
      };

    if (e.pack !== null && e.post !== null)
      return {
        elementCode: e.pack.elementCode,
        clusterCode: e.pack.clusterCode,
        quantity: e.pack.quantity,
        commitNumber: 0,
        projectCode: e.pack.projectCode,
        status: changeStatusEnum.UPDATE,
      };

    return {
      elementCode: '',
      clusterCode: '',
      quantity: 1,
      commitNumber: 0,
      projectCode: '',
      status: changeStatusEnum.UPDATE,
    };
  })
}

const getCommitterItems = (data: TrackingChangeModel<ItemViewModel>[]): CommittedItemModel[] => {
  return data.map(e => {
    if (e.pack === null && e.post !== null)
      return {
        serviceMasterCode: e.post.serviceMasterCode,
        clusterCode: e.post.clusterCode,
        billCode: e.post.billCode,
        quantity: e.post.quantity,
        commitNumber: 0,
        projectCode: e.post.projectCode,
        status: changeStatusEnum.DELETE,
      };

    if (e.pack !== null && e.post === null)
      return {
        serviceMasterCode: e.pack.serviceMasterCode,
        clusterCode: e.pack.clusterCode,
        billCode: e.pack.billCode,
        quantity: e.pack.quantity,
        commitNumber: 0,
        projectCode: e.pack.projectCode,
        status: changeStatusEnum.CREATE,
      };

    if (e.pack !== null && e.post !== null)
      return {
        serviceMasterCode: e.pack.serviceMasterCode,
        clusterCode: e.pack.clusterCode,
        billCode: e.pack.billCode,
        quantity: e.pack.quantity,
        commitNumber: 0,
        projectCode: e.pack.projectCode,
        status: changeStatusEnum.UPDATE,
      };

    return {
      serviceMasterCode: '',
      clusterCode: '',
      billCode: '',
      quantity: 1,
      commitNumber: 0,
      projectCode: '',
      status: changeStatusEnum.UPDATE,
    };
  })
}

const getCommitterResources = (data: TrackingChangeModel<ResourceViewModel>[]): CommittedResourceModel[] => {
  return data.map(e => {
    if (e.pack === null && e.post !== null)
      return {
        serviceMasterCode: e.post.serviceMasterCode,
        materialCode: e.post.materialCode,
        quantity: e.post.quantity,
        commitNumber: 0,
        projectCode: e.post.projectCode,
        status: changeStatusEnum.DELETE,
      };

    if (e.pack !== null && e.post === null)
      return {
        serviceMasterCode: e.pack.serviceMasterCode,
        materialCode: e.pack.materialCode,
        quantity: e.pack.quantity,
        commitNumber: 0,
        projectCode: e.pack.projectCode,
        status: changeStatusEnum.CREATE,
      };

    if (e.pack !== null && e.post !== null)
      return {
        serviceMasterCode: e.pack.serviceMasterCode,
        materialCode: e.pack.materialCode,
        quantity: e.pack.quantity,
        commitNumber: 0,
        projectCode: e.pack.projectCode,
        status: changeStatusEnum.UPDATE,
      };

    return {
      serviceMasterCode: '',
      materialCode: '',
      quantity: 1,
      commitNumber: 0,
      projectCode: '',
      status: changeStatusEnum.UPDATE,
    };
  })
}

const getCommitterConfirmations = (data: TrackingChangeModel<ConfirmationModel>[]): CommittedConfirmationModel[] => {
  return data.map(e => {
    if (e.pack === null && e.post !== null)
      return {
        elementCode: e.post.elementCode,
        postingDate: e.post.postingDate,
        commitNumber: 0,
        projectCode: e.post.projectCode,
        status: changeStatusEnum.DELETE,
      };

    if (e.pack !== null && e.post === null)
      return {
        elementCode: e.pack.elementCode,
        postingDate: e.pack.postingDate,
        commitNumber: 0,
        projectCode: e.pack.projectCode,
        status: changeStatusEnum.CREATE,
      };

    if (e.pack !== null && e.post !== null)
      return {
        elementCode: e.pack.elementCode,
        postingDate: e.pack.postingDate,
        commitNumber: 0,
        projectCode: e.pack.projectCode,
        status: changeStatusEnum.UPDATE,
      };

    return {
      elementCode: '',
      postingDate: new Date(),
      commitNumber: 0,
      projectCode: '',
      status: changeStatusEnum.UPDATE,
    };
  })
}

export const getPlannerCommitData = (data: PlannerTrackingChangeModel): PlannerCommit => {
  return {
    elements: getCommitterElements(data.elements),
  }
}

export const getDesignerCommitData = (data: DesignerTrackingChangeModel): DesignerCommit => {
  return {
    clusters: getCommitterClusters(data.clusters),
    elementClusters: getCommitterElementClusters(data.elementClusters),
    items: getCommitterItems(data.items),
  }
}

export const getEstimatorCommitData = (data: EstimatorTrackingChangeModel): EstimatorCommit => {
  return {
    resources: getCommitterResources(data.resources),
  }
}

export const getSupervisorCommitData = (data: SupervisorTrackingChangeModel): SupervisorCommit => {
  return {
    confirmations: getCommitterConfirmations(data.confirmations),
  }
}